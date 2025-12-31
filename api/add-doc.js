import { Client } from "pg";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ✅ PRIVATE CHECK
  const key = req.headers["x-admin-key"];
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { title, url } = req.body || {};
  if (!title || !url) {
    return res.status(400).json({ error: "title dan url wajib" });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const result = await client.query(
      `INSERT INTO public.documents (title, url, views, downloads, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       ON CONFLICT (url) DO NOTHING
       RETURNING id, title, url, views, downloads`,
      [title, url, 0, 0]
    );

    await client.end();

    if (result.rows.length === 0) {
      return res.status(200).json({ success: true, duplicated: true });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Add doc error:", err);
    try { await client.end(); } catch (_) {}
    return res.status(500).json({ error: err.message });
  }
}
