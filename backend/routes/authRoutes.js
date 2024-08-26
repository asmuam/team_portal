import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prismaClient from '../prisma/config.js'; // Sesuaikan dengan path prismaClient Anda

dotenv.config();

const router = express.Router();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Login route
router.post('/login', async (req, res) => {
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
        message: 'Username atau password tidak valid',
      });
    }

    // Buat access token dan refresh token
    const accessToken = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' } // Access token berlaku selama 1 jam
    );

    const refreshToken = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' } // Refresh token berlaku selama 7 hari
    );

    // Kirim refresh token dalam cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Pastikan cookie hanya dikirim melalui HTTPS jika di produksi
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });

    // Kirim access token dalam respons JSON
    res.status(200).json({
      success: true,
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
//   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRpYiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNDY0NzQ0MiwiZXhwIjoxNzI0NjUxMDQyfQ.BJHWxGe3y_F1idrCfNhJPODySPcR69PgUCtH0YhwHeo"
// }
// {
//   "success": false,
//   "message": "Username atau password tidak valid"
// }


// Refresh token route
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { id } = req.body;

    // Validasi input
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token tidak ditemukan' });

    // Temukan pengguna berdasarkan id
    const user = await prismaClient.user.findUnique({
      where: { id: +id },
    });

    if (!user) return res.status(404).json({ message: 'Akun tidak ditemukan' });

    // Verifikasi refresh token
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Refresh token tidak valid' });

      // Buat ulang access token
      const accessToken = jwt.sign(
        { userId: user.userId, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' } // Access token berlaku selama 1 jam
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

// Logout route (optional, if you need server-side token invalidation)
router.post('/logout', (req, res) => {
    // Invalidate token on the server side if needed (e.g., add it to a blacklist)
    res.clearCookie('refreshToken'); // Clear the refresh token cookie
    res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
