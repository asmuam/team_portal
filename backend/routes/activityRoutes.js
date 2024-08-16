const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const fileUpload = require('../middleware/fileUpload');

router.post('/activities', activityController.createActivity);
router.post('/subactivities', activityController.addSubActivity);
router.post('/upload', fileUpload, activityController.uploadEvidence);

// Additional routes for CRUD operations

module.exports = router;
