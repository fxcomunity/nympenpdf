import { Client } from "pg";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // Get total documents count
    const countResult = await client.query(
      'SELECT COUNT(*) as total FROM public.documents'
    );

    // Get total views and downloads
    const statsResult = await client.query(`
      SELECT 
        COALESCE(SUM(views), 0) as total_views,
        COALESCE(SUM(downloads), 0) as total_downloads
      FROM public.documents
    `);

    // Get recent activity
    const recentResult = await client.query(`
      SELECT COUNT(*) as today_uploads
      FROM public.documents 
      WHERE created_at >= CURRENT_DATE
    `);

    await client.end();

    return res.status(200).json({
      total_docs: parseInt(countResult.rows[0].total),
      total_views: parseInt(statsResult.rows[0].total_views),
      total_downloads: parseInt(statsResult.rows[0].total_downloads),
      today_uploads: parseInt(recentResult.rows[0].today_uploads),
      last_updated: new Date().toISOString()
    });
  } catch (err) {
    console.error("Stats error:", err);
    try { await client.end(); } catch (_) {}
    return res.status(500).json({ error: err.message });
  }
}
