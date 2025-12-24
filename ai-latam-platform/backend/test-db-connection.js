const { Client } = require('pg');

const connectionString = "postgresql://postgres.avcgvhfleqvvvgiveawy:Zhiailqx322%40@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres";

const client = new Client({
  connectionString,
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Connected to database successfully!');

    const result = await client.query('SELECT NOW() as current_time');
    console.log('Current time:', result.rows[0].current_time);

    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log('Tables:', tables.rows.map(r => r.table_name));

    await client.end();
    console.log('✅ Connection test completed!');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
