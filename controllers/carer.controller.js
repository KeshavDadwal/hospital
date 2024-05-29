const {responseObject,paginationResponseObject} = require("../helpers/responseCode");
const {responseCode} = require("../helpers/statusCode");
const {responseMessage} = require("../helpers/statusCodeMsg");
const {sendEmail} = require("../helpers/mail");
const {GenerateRandomString} = require('../helpers/randomString');
const extractFirstFrame = require("../helpers/videoframe")
const bcrypt = require('bcrypt');
const Carer  = require('../models/carer');
const Video  = require('../models/video');
const CarerLogin  = require('../models/carerLogin');
const jwt = require('jsonwebtoken');
const uploadImage = require('../helpers/s3bucket');
require('dotenv').config(); 
const path = require('path');


async function handlerCreateCarer(req, res) {
    try {
        if (!req.file) {
            return responseObject(
                req,
                res,
                "",
                responseCode.BAD_REQUEST,
                false,
                responseMessage.PLEASE_UPLOAD_THE_IMAGE
            );
        }
        
        const { company_id} = req.decodedToken;
        const { firstname, lastname, joining_date,email } = req.body;
        let { blocked } = req.body; 
        let password = GenerateRandomString(8);
        const hashedPassword = await bcrypt.hash(password, 10);
        const picture = await uploadImage(req.file.path, req.file.originalname,"carer");

        blocked = blocked === null || blocked === undefined ? false : blocked;
        const newCarer = await Carer.create({
            company_id,
            picture,
            firstname,
            lastname,
            email,
            password: hashedPassword,
            joining_date,
            blocked 
        });

        if (newCarer) {
            await sendEmail(email, password); 
            const responseData = {
                id: newCarer.id,
                company_id: newCarer.company_id,
                picture: newCarer.picture,
                firstname: newCarer.firstname,
                lastname: newCarer.lastname,
                email: newCarer.email,
                joining_date: newCarer.joining_date,
                blocked: newCarer.blocked
            };

            return responseObject(
                req,
                res,
                responseData,
                responseCode.OK,
                true,
                responseMessage.CARER_CREATED_SUCCESSFULLY
            );
        } else {
            return responseObject(
                req,
                res,
                "",
                responseCode.INTERNAL_SERVER_ERROR,
                true,
                responseMessage.SOMETHING_WENT_WRONG
            );
        }
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return responseObject(
                req,
                res,
                "",
                responseCode.BAD_REQUEST, 
                false,
               responseMessage.EMAIL_ALREADY_IN_USE
            );
        } else {
            return responseObject(
                req,
                res,
                "",
                responseCode.INTERNAL_SERVER_ERROR,
                false,
                responseMessage.SOMETHING_WENT_WRONG
            );
        }
    }
}

async function handlerGetCarer(req, res) {
    try {
        const { company_id} = req.decodedToken;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
        const offset = (page - 1) * pageSize;

        const carersData = await Carer.findAndCountAll({ 
            attributes: ['id', 'picture', 'firstname', 'lastname', 'joining_date', 'blocked','email'],
            where: {
                company_id: company_id,
                blocked: false
            },
            limit: pageSize,
            offset: offset,
            order: [['created_at', 'DESC']]
        });

        const totalCount = carersData.count;
        const carers = carersData.rows;

        const totalPages = Math.floor((totalCount + pageSize - 1) / pageSize);

        if (totalCount > 0) {

            carers.forEach(carer => {
    
                carer.picture = process.env.BUCKET_URL+"/" + carer.picture;
            });


            return paginationResponseObject(
                req,
                res,
                carers,
                totalPages,
                page,
                pageSize,
                responseCode.OK,
                true,
                ""
            );
        } else {
            return responseObject(
                req,
                res,
                "",
                responseCode.OK,
                true,
               responseMessage.NO_DATA_FOUND
            );
        }
    } catch (err) {
        return responseObject(
            req,
            res,
            "",
            responseCode.INTERNAL_SERVER_ERROR,
            false,
            responseMessage.SOMETHING_WENT_WRONG
        );
    }
}

async function handlerGetCarerById(req,res) {
    try {
        const { company_id} = req.decodedToken;
        const carerId = req.params.id; 
        const carer = await Carer.findOne({
            where: {
              id: carerId,
              company_id: company_id
            }
          });
        if (!carer) {
            return responseObject(
                req,
                res,
                "",
                responseCode.NOT_FOUND,
                false,
                responseMessage.CARER_NOT_FOUND
            );
        }
        if (carer) {
            return responseObject(
                req,
                res,
                carer,
                responseCode.OK,
                true,
                ""
            );
        } 
    } catch (error) {
        return responseObject(
            req,
            res,
            "",
            responseCode.INTERNAL_SERVER_ERROR,
            false,
            responseMessage.SOMETHING_WENT_WRONG
        );
    }
}

async function handlerUpdateCarer(req, res) {
    try {

        if (!req.file) {
            return responseObject(
                req,
                res,
                "",
                responseCode.BAD_REQUEST,
                false,
                responseMessage.PLEASE_UPLOAD_THE_IMAGE
            );
        }

        const { company_id} = req.decodedToken;
        const carerId = req.params.id; 
        const {firstname, lastname} = req.body;
        const picture = await uploadImage(req.file.path, req.file.originalname,"carer");
        const carer = await Carer.findOne({
            where: {
              id: carerId,
              company_id: company_id
            }
          });

        if (!carer) {
            return responseObject(
                req,
                res,
                "",
                responseCode.NOT_FOUND,
                false,
                responseMessage.CARER_NOT_FOUND
            );
        }

        await carer.update({
            company_id,
            picture,
            firstname,
            lastname
        });

        return responseObject(
            req,
            res,
            carer,
            responseCode.OK,
            true,
            responseMessage.CARER_UPDATED_SUCCESSFULLY
        );
    } catch (err) {
        return responseObject(
            req,
            res,
            "",
            responseCode.INTERNAL_SERVER_ERROR,
            false,
           responseMessage.SOMETHING_WENT_WRONG
        );
    }
}

async function handlerDeleteCarer(req, res) {
    try {
        const carerId = req.params.id; 
        const { company_id} = req.decodedToken;
        const carer = await Carer.findOne({
            where: {
              id: carerId,
              company_id: company_id
            }
          });

        if (!carer) {
            return responseObject(
                req,
                res,
                "",
                responseCode.NOT_FOUND,
                false,
                responseMessage.CARER_NOT_FOUND
            );
        }

        await carer.destroy();

        return responseObject(
            req,
            res,
            "",
            responseCode.OK,
            true,
            responseMessage.CARER_DELETED_SUCCESSFULLY
        );
    } catch (err) {
        return responseObject(
            req,
            res,
            "",
            responseCode.INTERNAL_SERVER_ERROR,
            false,
            responseMessage.SOMETHING_WENT_WRONG
        );
    }
}

async function handlerCarerLogin(req, res) {
    try {
        const { email, password,devicetype,devicetoken } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingCarer = await Carer.findOne({ where: { email: email } });

        if (existingCarer) {
            
            const isPasswordMatch = await bcrypt.compare(password, existingCarer.password);
            if (isPasswordMatch) {

                const token = jwt.sign(
                    { carer_id: existingCarer.id, email: existingCarer.email},
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '10h' }
                );

                const newCarer = await CarerLogin.create({
                    email,
                    password: hashedPassword,
                    devicetype,
                    devicetoken 
                });

                if(newCarer){
                    const responseData = {
                        email: newCarer.email,
                        token: token
                    };

                    return responseObject(
                        req,
                        res,
                        responseData,
                        responseCode.OK,
                        true,
                        responseMessage.CARER_LOGIN_SUCCESSFULLY
                    );
                }
            } else {
                return responseObject(
                    req,
                    res,
                    "",
                    responseCode.UNAUTHORIZED,
                    true,
                    responseMessage.INVALID_LOGIN_OR_PASSWORD
                );
            }
        } else {
            return responseObject(
                req,
                res,
                "",
                responseCode.NOT_FOUND, 
                true,
                responseMessage.UNABLE_TO_FIND_THE_CARER
            );
        }
    } catch (err) {
        return responseObject(
            req,
            res,
            "",
            responseCode.INTERNAL_SERVER_ERROR,
            false,
            responseMessage.SOMETHING_WENT_WRONG
        );
    }
}

async function handlerGetCarerVideo(req, res) {
    try {
        const { client } = req.query;
        if (!client) {
            return res.status(400).json({
                success: false,
                message: "client_id is required"
            });
        }
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
        const offset = (page - 1) * pageSize;

        const videosData = await Video.findAndCountAll({
            attributes: ['id', 'title', 'views', 'likes','video_path','video_frame','carer_id','created_at', 'updated_at'],
            where: {
                client_id: client
            },
            limit: pageSize,
            offset: offset,
            order: [['created_at', 'DESC']]
        });

        const totalCount = videosData.count;
        const videos = videosData.rows;

        videos.forEach(video => {
            video.video_frame = process.env.BUCKET_URL+"/" + video.video_frame;
            video.video_path = process.env.BUCKET_URL+"/" + video.video_path;
        });

        const totalPages = Math.ceil(totalCount / pageSize);

        if (totalCount > 0) {
            return paginationResponseObject(
                req,
                res,
                videos,
                totalPages,
                page,
                pageSize,
                responseCode.OK,
                true,
                ""
            );
        } else {
            return responseObject(
                req,
                res,
                "",
                responseCode.OK,
                false,
                responseMessage.NO_VIDEOS_FOUND
            );
        }
    } catch (err) {
        return responseObject(
            req,
            res,
            "",
            responseCode.BAD_REQUEST,
            false,
            responseMessage.SOMETHING_WENT_WRONG
        );
    }
}


async function handlerCreateVideo(req, res) {
    try {
        if (!req.file) {
            return responseObject(
                req,
                res,
                "",
                responseCode.BAD_REQUEST,
                false,
                responseMessage.PLEASE_UPLOAD_THE_VIDEO
            );
        }

        const { carer_id, company_id } = req.decodedToken;
        const { client_id, title } = req.body;

        const videoPath = await uploadImage(req.file.path, req.file.originalname, "videos");

        const frameDetails = await extractFirstFrame(req.file.path, ".");
        const frameOutputPath = frameDetails.path;
        const frameFileName = frameDetails.name;

        const uploadedFramePath = await uploadImage(frameOutputPath, frameFileName, "videos_frame");

        const newVideo = await Video.create({
            client_id,
            carer_id,
            company_id,
            likes: 0,
            views: 0,
            title,
            video_path: videoPath,
            video_frame: uploadedFramePath  
        });

        if (newVideo) {
            return responseObject(
                req,
                res,
                newVideo,
                responseCode.OK,
                true,
                responseMessage.VIDEOS_UPLOADED_SUCCESSFULLY
            );
        } else {
            return responseObject(
                req,
                res,
                "",
                responseCode.INTERNAL_SERVER_ERROR,
                true,
                responseMessage.SOMETHING_WENT_WRONG
            );
        }
    } catch (err) {
        return responseObject(
            req,
            res,
            "",
            responseCode.INTERNAL_SERVER_ERROR,
            false,
            responseMessage.SOMETHING_WENT_WRONG
        );
    }
}

async function handlerUpdateVideo(req, res) {
    try {
        const videoId = req.params.id; 
        const video = await Video.findOne({
            where: {
              id: videoId,
            }
          });
        
        const {title} = req.body;
        

        if (!video) {
            return responseObject(
                req,
                res,
                "",
                responseCode.NOT_FOUND,
                false,
                responseMessage.VIDEO_NOT_FOUND
            );
        }

        await video.update({
            title
        });

        return responseObject(
            req,
            res,
            video,
            responseCode.OK,
            true,
            responseMessage.VIDEO_UPDATED_SUCCESSFULLY
        );
    } catch (err) {
        return responseObject(
            req,
            res,
            "",
            responseCode.INTERNAL_SERVER_ERROR,
            false,
           responseMessage.SOMETHING_WENT_WRONG
        );
    }
}

async function handlerDeleteClientVideo(req, res) {
    try {
        const videoId = req.params.id; 
        const video = await Video.findOne({
            where: {
              id: videoId,
            }
          });

        if (!video) {
            return responseObject(
                req,
                res,
                "",
                responseCode.NOT_FOUND,
                false,
                responseMessage.VIDEO_NOT_FOUND
            );
        }

        await video.destroy();

        return responseObject(
            req,
            res,
            "",
            responseCode.OK,
            true,
            responseMessage.VIDEO_DELETED_SUCCESSFULLY
        );
    } catch (err) {
        return responseObject(
            req,
            res,
            "",
            responseCode.INTERNAL_SERVER_ERROR,
            false,
            responseMessage.SOMETHING_WENT_WRONG
        );
    }
}

module.exports = {
    handlerGetCarer,
    handlerCreateCarer,
    handlerDeleteCarer,
    handlerUpdateCarer,
    handlerGetCarerById,
    handlerCarerLogin,
    handlerGetCarerVideo,
    handlerCreateVideo,
    handlerDeleteClientVideo,
    handlerUpdateVideo
}
