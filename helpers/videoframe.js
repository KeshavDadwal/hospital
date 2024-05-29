const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

const extractFirstFrame = (videoPath, directory = '.') => {
    return new Promise((resolve, reject) => {
        const frameName = 'firstFrame.png';
        const frameOutputPath = path.join(process.cwd(), directory, frameName);

        ffmpeg(videoPath)
            .on('end', () => {
                console.log('Frame extracted successfully');
                resolve({ path: frameOutputPath, name: frameName }); 
            })
            .on('error', (err) => {
                console.error('Error extracting frame:', err);
                reject(err);
            })
            .screenshots({
                timestamps: ['0'],
                count: 1,
                size: '600x600', 
                folder: path.join(process.cwd(), directory), 
                filename: frameName, 
                png: true 
            });
    });
};

module.exports = extractFirstFrame;
