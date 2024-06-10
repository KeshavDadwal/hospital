const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); 

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION // Ensure region is set
});

const s3 = new AWS.S3();
const bucketName = process.env.AWS_BUCKET_NAME;

async function uploadImage(filePath, originalFilename, folder) {
    const timestamp = new Date().getTime(); 
    const sanitizedFilename = originalFilename.replace(/[^\w\s.-]/g, '_');
    const s3Key = `${folder}/${timestamp}_${sanitizedFilename}`;

    const fileStream = fs.createReadStream(filePath);
    const fileStats = fs.statSync(filePath);

    const uploadParams = {
        Bucket: bucketName,
        Key: s3Key,
        Body: fileStream
    };

    try {
        if (fileStats.size > 5 * 1024 * 1024) { // If file is larger than 5MB, use multipart upload
            const multipartUpload = s3.createMultipartUpload({
                Bucket: bucketName,
                Key: s3Key,
            }).promise();

            const parts = [];
            const partSize = 5 * 1024 * 1024; // Each part is 5MB
            let partNumber = 1;

            for (let offset = 0; offset < fileStats.size; offset += partSize) {
                const partParams = {
                    Bucket: bucketName,
                    Key: s3Key,
                    PartNumber: partNumber,
                    UploadId: multipartUpload.UploadId,
                    Body: fileStream,
                };

                const part = await s3.uploadPart(partParams).promise();
                parts.push({ ETag: part.ETag, PartNumber: partNumber });

                partNumber++;
            }

            const completeMultipartUploadParams = {
                Bucket: bucketName,
                Key: s3Key,
                UploadId: multipartUpload.UploadId,
                MultipartUpload: {
                    Parts: parts,
                },
            };

            await s3.completeMultipartUpload(completeMultipartUploadParams).promise();
        } else {
            await s3.upload(uploadParams).promise();
        }

        return s3Key;
    } catch (err) {
        console.error("Error uploading file:", err);
        throw err;
    } finally {
        fileStream.destroy(); // Ensure the stream is closed properly
    }
}

module.exports = uploadImage;

// const AWS = require('aws-sdk');
// const fs = require('fs');
// const path = require('path');
// require('dotenv').config(); 

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   secretAccessKey: process.env.AWS_SECRET_KEY
// });

// const s3 = new AWS.S3();
// const bucketName = process.env.AWS_BUCKET_NAME;

// async function uploadImage(filePath, originalFilename, folder) {
//     try {
//         const timestamp = new Date().getTime(); 
//         const fileStream = fs.createReadStream(filePath);
//         const sanitizedFilename = originalFilename.replace(/[^\w\s.-]/g, '_');
//         const uploadParams = {
//             Bucket: bucketName,
//             Key: `${folder}/${timestamp}_${sanitizedFilename}`, 
//             Body: fileStream
//         };

//         const uploadResult = await s3.upload(uploadParams).promise();
//         return uploadResult.Key; 
//     } catch (err) {
//         console.error("Error uploading file:", err);
//         throw err;
//     }
// }

// module.exports = uploadImage;
