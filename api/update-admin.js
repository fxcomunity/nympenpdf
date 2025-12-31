import bcrypt from "bcryptjs";
import { Client } from "pg";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const adminKey = req.headers["x-admin-key"];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "ADMIN KEY salah" });
  }

  const { oldUsername, newUsername, newPassword } = req.body || {};
  if (!oldUsername) return res.status(400).json({ error: "oldUsername wajib" });

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const find = await client.query(
      "SELECT * FROM public.admin_users WHERE username=$1 LIMIT 1",
      [oldUsername]
    );

    if (find.rows.length === 0) {
      await client.end();
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    let updates = [];
    let values = [];
    let idx = 1;

    if (newUsername) {
      updates.push(`username=$${idx++}`);
      values.push(newUsername);
    }

    if (newPassword) {
      const hash = await bcrypt.hash(newPassword, 10);
      updates.push(`password_hash=$${idx++}`);
      values.push(hash);
    }

    if (!updates.length) {
      await client.end();
      return res.status(400).json({ error: "Tidak ada perubahan" });
    }

    values.push(oldUsername);

    await client.query(
      `UPDATE public.admin_users SET ${updates.join(", ")} WHERE username=$${idx}`,
      values
    );

    await client.end();
    return res.status(200).json({ success: true });
  } catch (err) {
    try { await client.end(); } catch (_) {}
    return res.status(500).json({ error: err.message });
  }
}
