import { Client } from "pg";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const result = await client.query(
      "SELECT id, title, url FROM public.documents ORDER BY id DESC"
    );

    await client.end();
    return res.status(200).json(result.rows);
  } catch (err) {
    try { await client.end(); } catch (_) {}
    return res.status(500).json({ error: err.message });
  }
}
