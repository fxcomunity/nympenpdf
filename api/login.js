export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  // contoh data hardcode (nanti kita pakai database neon admin_users)
  if (username === "admin" && password === "admin123") {
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: "Username atau password salah" });
}
