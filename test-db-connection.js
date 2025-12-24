const { Client } = require('pg');

const configs = [
  // Test 1: Direct connection
  {
    name: 'Direct (5432)',
    connectionString: 'postgresql://postgres.avcgvhfleqvvvgiveawy:Zhiailqx322@db.avcgvhfleqvvvgiveawy.supabase.co:5432/postgres?sslmode=require'
  },
  // Test 2: Pooler 6543
  {
    name: 'Pooler (6543)',
    connectionString: 'postgresql://postgres.avcgvhfleqvvvgiveawy:Zhiailqx322@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?sslmode=require'
  },
  // Test 3: Pooler 5432
  {
    name: 'Pooler (5432)',
    connectionString: 'postgresql://postgres.avcgvhfleqvvvgiveawy:Zhiailqx322@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres?sslmode=require'
  }
];

async function testConnection(config) {
  const client = new Client({ connectionString: config.connectionString });
  try {
    await client.connect();
    const result = await client.query('SELECT NOW()');
    console.log(`✅ ${config.name}: SUCCESS - ${result.rows[0].now}`);
    await client.end();
    return true;
  } catch (error) {
    console.log(`❌ ${config.name}: FAILED - ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('Testing database connections...\n');
  for (const config of configs) {
    await testConnection(config);
  }
}

main();
