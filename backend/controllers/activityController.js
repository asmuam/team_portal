const Activity = require('../models/activityModel');
const { convertAndUploadFile } = require('../utils/fileConversion');

exports.createActivity = async (req, res) => {
    const { name } = req.body;
    const newActivity = new Activity({ name });
    await newActivity.save();
    res.status(201).json(newActivity);
};

exports.addSubActivity = async (req, res) => {
    const { activityId, name } = req.body;
    const activity = await Activity.findById(activityId);
    activity.subActivities.push({ name });
    await activity.save();
    res.status(201).json(activity);
};

exports.uploadEvidence = async (req, res) => {
    const { activityId, subActivityId } = req.body;
    const activity = await Activity.findById(activityId);
    const subActivity = activity.subActivities.id(subActivityId);

    const fileUrl = await convertAndUploadFile(req.file.buffer, req.file.originalname);
    subActivity.evidence.push(fileUrl);
    await activity.save();

    res.status(200).json(subActivity);
};

// Other CRUD operations like delete, update, and progress calculation would go here.
