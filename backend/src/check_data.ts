import pool from './db';

async function checkData() {
  try {
    const cases = await pool.query('SELECT count(*) FROM cases');
    console.log('Cases count:', cases.rows[0].count);

    const users = await pool.query('SELECT count(*) FROM users');
    console.log('Users count:', users.rows[0].count);

    const docs = await pool.query('SELECT count(*) FROM documents');
    console.log('Documents count:', docs.rows[0].count);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkData();