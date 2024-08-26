import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'; // Jangan lupa untuk menambahkan ekstensi .js
import explorerRoutes from './routes/explorerRoutes.js'; // Jangan lupa untuk menambahkan ekstensi .js
import linkPentingRoutes from './routes/linkPentingRoutes.js'; // Jangan lupa untuk menambahkan ekstensi .js
import authenticateToken from './middleware/authMiddleware.js'; // Jangan lupa untuk menambahkan ekstensi .js

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

app.use('/api', authRoutes);  // Add authRoutes to handle authentication
app.use('/api', explorerRoutes);  
// app.use('/api', tabelRoutes);  
app.use('/api', linkPentingRoutes);  


app.listen(5000, () => {
    console.log('Server running on port 5000');
});
