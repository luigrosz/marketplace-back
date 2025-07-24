import pool from './pool';

async function dropTables() {
  try {
    console.log('Dropping tables...');
    await pool.query('DROP TABLE IF EXISTS Votes CASCADE;');
    await pool.query('DROP TABLE IF EXISTS Products CASCADE;');
    await pool.query('DROP TABLE IF EXISTS Users CASCADE;');
    await pool.query('DROP TABLE IF EXISTS Category CASCADE;');
    console.log('Tables dropped successfully.');
  } catch (error) {
    console.error('Error dropping tables:', error);
  } finally {
    await pool.end();
  }
}

dropTables();
