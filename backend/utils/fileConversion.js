const sharp = require('sharp'); // For image conversion
const { Storage } = require('@google-cloud/storage');
const config = require('../config');

const storage = new Storage({
    projectId: config.googleCloud.projectId,
    keyFilename: config.googleCloud.keyFilename
});

const bucket = storage.bucket(config.googleCloud.bucketName);

const convertAndUploadFile = async (fileBuffer, fileName) => {
    const convertedBuffer = await sharp(fileBuffer).resize(800).toBuffer(); // Example: Resize image

    const file = bucket.file(fileName);
    await file.save(convertedBuffer);
    
    return file.publicUrl();
};

module.exports = { convertAndUploadFile };
