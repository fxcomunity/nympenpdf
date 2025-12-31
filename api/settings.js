import { Client } from "pg";

export default async function handler(req, res) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // ✅ GET SETTINGS
    if (req.method === "GET") {
      const result = await client.query(`
        SELECT maintenance, updated_at
        FROM public.settings
        ORDER BY id DESC
        LIMIT 1
      `);

      await client.end();
      return res.status(200).json(result.rows[0] || { maintenance: false });
    }

    // ✅ POST UPDATE SETTINGS (PRIVATE)
    if (req.method === "POST") {
      const key = req.headers["x-admin-key"];
      if (!key || key !== process.env.ADMIN_KEY) {
        await client.end();
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { maintenance } = req.body || {};
      if (typeof maintenance !== "boolean") {
        await client.end();
        return res.status(400).json({ error: "maintenance wajib boolean" });
      }

      const result = await client.query(
        `UPDATE public.settings
         SET maintenance = $1, updated_at = NOW()
         WHERE id = (SELECT id FROM public.settings ORDER BY id DESC LIMIT 1)
         RETURNING maintenance, updated_at`,
        [maintenance]
      );

      await client.end();
      return res.status(200).json({ success: true, data: result.rows[0] });
    }

    await client.end();
    return res.status(405).json({ error: "Method not allowed" });

  } catch (err) {
    try { await client.end(); } catch (_) {}
    return res.status(500).json({ error: err.message });
  }
}
