/**
 * Check the actual database schema for learning_notes table
 * Run from backend directory with: npx tsx scripts/check-learning-notes-table.ts
 */

// 1. 修改导入方式，直接导入 Client
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

// 2. 这里的 const { Client } = pg; 不需要了，因为上面已经导入了

// 类型定义
interface ColumnInfo {
  column_name: string;
  data_type: string;
  udt_name: string;
}

async function checkSchema() {
  console.log('🔍 Starting database schema check...');

  let connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    try {
      const envPath = path.join(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const directUrlMatch = envContent.match(/^DIRECT_URL=["']?([^"'\n]+)["']?$/m);
        const dbUrlMatch = envContent.match(/^DATABASE_URL=["']?([^"'\n]+)["']?$/m);

        if (directUrlMatch) {
          connectionString = directUrlMatch[1].trim();
          console.log('✅ Loaded DIRECT_URL from .env file');
        } else if (dbUrlMatch) {
          connectionString = dbUrlMatch[1].trim();
          console.log('✅ Loaded DATABASE_URL from .env file');
        }
      }
    } catch (error) {
      console.warn('⚠️  Could not read .env file, checking environment variables only.');
    }
  }

  if (!connectionString) {
    console.error('❌ Error: DATABASE_URL or DIRECT_URL not found in environment or .env file');
    process.exit(1);
  }

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    console.log('📋 learning_notes table columns:');
    // 注意：这里保留泛型 <ColumnInfo>
    const result = await client.query<ColumnInfo>(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_name = 'learning_notes'
      ORDER BY ordinal_position;
    `);

    if (result.rows.length === 0) {
      console.log('❌ Table "learning_notes" does not exist in the database.');
      return;
    }

    // 3. 修复报错：显式指定 (row: ColumnInfo) 类型
    console.table(result.rows.map((row: ColumnInfo) => ({
      Column: row.column_name,
      Type: row.data_type,
      UDT: row.udt_name
    })));

    console.log('\n----------------------------------------\n');

    // 4. 修复报错：显式指定 (r: ColumnInfo) 类型
    const tagsColumn = result.rows.find((r: ColumnInfo) => r.column_name === 'tags');
    
    if (tagsColumn) {
      console.log(`📌 Checking 'tags' column... Found UDT: [ ${tagsColumn.udt_name} ]`);

      if (tagsColumn.udt_name === '_text') {
        console.log('\n⚠️  PROBLEM DETECTED: tags is defined as text[] (PostgreSQL array)');
        console.log('    But Prisma schema expects Json (jsonb).');
        console.log('\n🔧 RECOMMENDED FIX: run the SQL script in Supabase SQL Editor:');
        console.log('    backend/scripts/fix-tags-column.sql');
        console.log('\nIf you need the exact SQL here, see the script contents.');
      } else if (tagsColumn.udt_name === 'jsonb') {
        console.log('✅ STATUS: OK. tags column is correctly defined as jsonb.');
      } else {
        console.log(`❓ WARNING: tags column has an unexpected type: ${tagsColumn.udt_name}`);
      }
    } else {
      console.error('❌ Error: tags column not found in learning_notes table!');
    }

  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Connection Error:', error.message);
    } else {
      console.error('❌ Unknown Error:', error);
    }
  } finally {
    await client.end();
  }
}

checkSchema();
