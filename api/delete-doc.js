import { Client } from "pg";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ✅ PRIVATE CHECK
  const key = req.headers["x-admin-key"];
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.body || {};
  if (!id) {
    return res.status(400).json({ error: "id wajib" });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const result = await client.query(
      "DELETE FROM public.documents WHERE id = $1 RETURNING id",
      [id]
    );

    await client.end();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "data tidak ditemukan" });
    }

    return res.status(200).json({ success: true, deleted_id: result.rows[0].id });
  } catch (err) {
    try { await client.end(); } catch (_) {}
    return res.status(500).json({ error: err.message });
  }
}
