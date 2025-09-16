import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
});

export async function closeDb() {
  await pool.end();
}

export async function query(text: string, params?: any[]) {
  const res = await pool.query(text, params);
  return res;
}
