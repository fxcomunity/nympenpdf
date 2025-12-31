import bcrypt from "bcryptjs";
import { Client } from "pg";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "username & password wajib" });

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const hash = await bcrypt.hash(password, 10);

    await client.query(
      "INSERT INTO public.admin_users (username, password_hash) VALUES ($1, $2)",
      [username, hash]
    );

    await client.end();
    res.status(200).json({ success: true });
  } catch (err) {
    try { await client.end(); } catch (_) {}
    res.status(500).json({ error: err.message });
  }
}
