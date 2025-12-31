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

    const result = await client.query(
      "SELECT * FROM public.admin_users WHERE username = $1 LIMIT 1",
      [username]
    );

    await client.end();

    if (result.rows.length === 0) return res.status(401).json({ error: "Username salah" });

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Password salah" });

    return res.status(200).json({ success: true });
  } catch (err) {
    try { await client.end(); } catch (_) {}
    return res.status(500).json({ error: err.message });
  }
}
