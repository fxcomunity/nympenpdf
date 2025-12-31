import { Client } from "pg";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, type } = req.body || {};

  if (!id || !type) {
    return res.status(400).json({ error: "id dan type wajib" });
  }

  if (!["view", "download"].includes(type)) {
    return res.status(400).json({ error: "type harus view atau download" });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const field = type === "view" ? "views" : "downloads";

    await client.query(
      `UPDATE public.documents SET ${field} = ${field} + 1 WHERE id = $1`,
      [id]
    );

    await client.end();

    return res.status(200).json({ success: true });
  } catch (err) {
    try { await client.end(); } catch (_) {}
    return res.status(500).json({ error: err.message });
  }
}
