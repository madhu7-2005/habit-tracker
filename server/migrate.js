const fs = require('fs');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://madhu2005:Sudha@2005@localhost:5432/habitdb';
const pool = new Pool({ connectionString });

async function runMigration() {
  try {
    const sql = fs.readFileSync('./migrations/init.sql', 'utf8');
    await pool.query(sql);
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
