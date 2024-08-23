const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const explorerRoutes = require('./routes/explorerRoutes');
const authenticateToken = require('./middleware/authMiddleware');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

app.use('/api', authRoutes);  // Add authRoutes to handle authentication
app.use('/api', explorerRoutes);  
app.use('/api/secure-endpoint', authenticateToken, (req, res) => {
    res.json({ message: 'This is a secure endpoint' });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
