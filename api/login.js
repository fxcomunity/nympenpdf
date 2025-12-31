import bcrypt from "bcryptjs";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  try {
    // ✅ hanya POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username & password wajib diisi" });
    }

    // ✅ ambil data admin dari DB
    const result = await pool.query(
      `SELECT id, username, password_hash, admin_key 
       FROM admin_user 
       WHERE username = $1
       LIMIT 1`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: "Username tidak ditemukan" });
    }

    const admin = result.rows[0];

    // ✅ check password hash
    const valid = await bcrypt.compare(password, admin.password_hash);

    if (!valid) {
      return res.status(401).json({ success: false, error: "Password salah" });
    }

    // ✅ sukses
    return res.status(200).json({
      success: true,
      message: "Login berhasil",
      username: admin.username,
      adminKey: admin.admin_key,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Server error", detail: err.message });
  }
}
