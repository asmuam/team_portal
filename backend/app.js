const express = require('express');
const mongoose = require('mongoose');
const activityRoutes = require('./routes/activityRoutes');
const config = require('./config');

const app = express();
app.use(express.json());

mongoose.connect(config.dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api', activityRoutes);

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
