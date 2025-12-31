import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { username, password } = req.body;

    const sql = neon(process.env.DATABASE_URL);

    const result = await sql`
      SELECT * FROM admin_settings
      WHERE username = ${username} AND password = ${password}
      LIMIT 1
    `;

    if (result.length === 0) {
      return res.status(401).json({ error: "Username / Password salah!" });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
