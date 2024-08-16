const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.memoryStorage(); // Store in memory for conversion
const upload = multer({ storage: storage });

module.exports = upload.single('file');
