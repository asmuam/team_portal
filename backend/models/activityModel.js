const mongoose = require('mongoose');

const subActivitySchema = new mongoose.Schema({
    name: String,
    progress: Number,
    evidence: [String], // URLs of files
    status: { type: String, enum: ['On Time', 'Late'], default: 'On Time' },
    checked: Boolean
});

const activitySchema = new mongoose.Schema({
    name: String,
    subActivities: [subActivitySchema],
    progress: Number
});

module.exports = mongoose.model('Activity', activitySchema);
