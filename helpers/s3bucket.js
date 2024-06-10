const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); 

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

const s3 = new AWS.S3();
const bucketName = process.env.AWS_BUCKET_NAME;

async function uploadImage(filePath, originalFilename, folder) {
    try {
        const timestamp = new Date().getTime(); 
        const fileStream = fs.createReadStream(filePath);
        const sanitizedFilename = originalFilename.replace(/[^\w\s.-]/g, '_');
        const uploadParams = {
            Bucket: bucketName,
            Key: `${folder}/${timestamp}_${sanitizedFilename}`, 
            Body: fileStream
        };

        const uploadResult = await s3.upload(uploadParams).promise();
        return uploadResult.Key; 
    } catch (err) {
        console.error("Error uploading file:", err);
        throw err;
    }
}

module.exports = uploadImage;
