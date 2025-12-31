export default function handler(req, res) {
  const url = process.env.DATABASE_URL || "";
  res.status(200).json({
    hasDatabaseUrl: !!url,
    startsWith: url.slice(0, 20),
    containsBase: url.includes("base"),
    length: url.length,
  });
}
