import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Middleware untuk memeriksa dan memverifikasi token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Mengambil token dari header Authorization

  if (token == null) return res.sendStatus(401); // Jika token tidak ada, kirim status 401 (Unauthorized)

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Jika token tidak valid, kirim status 403 (Forbidden)
    req.user = user; // Simpan informasi pengguna dalam objek request
    next(); // Lanjutkan ke rute berikutnya
  });
};

// Middleware untuk memeriksa peran pengguna
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({ message: "Akses ditolak" }); // Jika peran tidak diizinkan, kirim status 403 (Forbidden)
    }
    next(); // Lanjutkan ke rute berikutnya
  };
};

export { authenticateToken, authorizeRole };
