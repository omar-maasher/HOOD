const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: "postgresql://postgres.tyrmjdreiroukmooqhar:WyEZ2HvBpe%402%26%26%23@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres"
  });
  
  try {
    await client.connect();
    const res = await client.query('SELECT * FROM public.integration');
    console.log('--- ALL INTEGRATIONS ---');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
