import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prismaClient from "../prisma/config.js"; // Sesuaikan dengan path prismaClient Anda

dotenv.config();

const router = express.Router();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password tidak boleh kosong",
      });
    }

    // Temukan pengguna berdasarkan username
    const user = await prismaClient.user.findUnique({
      where: { username: username },
    });

    // Verifikasi pengguna dan kata sandi
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        success: false,
        message: "Username atau password tidak valid",
      });
    }

    // Buat access token dan refresh token
    const accessToken = jwt.sign({ userId: user.id, username: user.username, role: user.role, name: user.name }, ACCESS_TOKEN_SECRET, { expiresIn: "5m" });

    const refreshToken = jwt.sign({ userId: user.id, username: user.username, role: user.role, name: user.name }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    // Update user record with the new refresh token
    await prismaClient.user.update({
      where: { id: user.id },
      data: { refresh_token: refreshToken },
    });

    // Kirim refresh token dalam cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Kirim access token dan data user dalam respons JSON
    res.status(200).json({
      success: true,
      uid: user.id,
      name: user.name,
      username: user.username, // Tambahkan ini
      role: user.role,
      accessToken,
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({
      message: "Internal server error",
      error: e.message,
    });
  }
});

// {
//   "success": true,
//   "uid": 1,
//   "accessToken": "accessToken",
//   "role": "role"
//   "name": "name"
//   "username": "username"
// }
// {
//   "success": false,
//   "message": "Username atau password tidak valid"
// }

// Refresh token route
router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { uid } = req.body;

    // Validasi input
    if (!refreshToken) return res.status(401).json({ message: "Refresh token tidak ditemukan" });

    // Temukan pengguna berdasarkan id
    const user = await prismaClient.user.findUnique({
      where: { id: +uid },
    });

    if (!user) return res.status(404).json({ message: "Akun tidak ditemukan" });

    // Verifikasi refresh token
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Refresh token tidak valid" });

      // Buat ulang access token
      const accessToken = jwt.sign(
        { userId: user.userId, username: user.username, role: user.role, name: user.name },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" } // Access token berlaku selama 1 jam
      );

      res.status(200).json({ accessToken });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// resp {
//   "accessToken": "newAccessToken"
// }

// Logout route (optional, if you need server-side token invalidation)
router.post("/logout", (req, res) => {
  // Invalidate token on the server side if needed (e.g., add it to a blacklist)
  res.clearCookie("refreshToken"); // Clear the refresh token cookie
  res.json({ success: true, message: "Logged out successfully" });
});

// resp {
//   "success": true,
//   "message": "Logged out successfully"
// }

export default router;
