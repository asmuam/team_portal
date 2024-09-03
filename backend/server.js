import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'; // Jangan lupa untuk menambahkan ekstensi .js
import explorerRoutes from './routes/explorerRoutes.js'; // Jangan lupa untuk menambahkan ekstensi .js
import linkPentingRoutes from './routes/linkPentingRoutes.js'; // Jangan lupa untuk menambahkan ekstensi .js
import userRoutes from './routes/userRoutes.js'; // Jangan lupa untuk menambahkan ekstensi .js
import { authenticateToken, authorizeRole } from "./middleware/authMiddleware.js"; // Sesuaikan dengan path authMiddleware.js
import cookieParser from 'cookie-parser';

const app = express();
// Konfigurasi CORS
app.use(cors({
    origin: 'http://localhost:3000', // Ganti dengan URL frontend Anda
    credentials: true // Izinkan kredensial (cookies, header otorisasi, dll.)
}));
app.use(express.json());
app.use(cookieParser()); // membaca cookies

app.use('/api', authRoutes);  // Add authRoutes to handle authentication
app.use('/api', authenticateToken, authorizeRole(["admin", "pegawai"]), explorerRoutes);
// app.use('/api', tabelRoutes);  
app.use('/api', authenticateToken, authorizeRole(["admin", "pegawai"]), linkPentingRoutes);
app.use('/api/user', authenticateToken, authorizeRole("admin"), userRoutes);


app.listen(5000, () => {
    console.log('Server running on port 5000');
});
