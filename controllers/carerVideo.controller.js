const {responseObject,paginationResponseObject} = require("../helpers/responseCode");
const {responseCode} = require("../helpers/statusCode");
const {responseMessage} = require("../helpers/statusCodeMsg");
const CarerVideo  = require('../models/carerVideo');
const Video  = require('../models/video');
require('dotenv').config(); 


async function handlerUpdateVideoCount(req, res) {
    try {
        const { carer_id} = req.decodedToken;
        const {video_id} = req.body;


        const { count } = await CarerVideo.findAndCountAll({
            where: { video_id: video_id, carer_id: carer_id }
        });

        if (count === 0) {
            const newCarerVideo = await CarerVideo.create({
                carer_id,
                is_seen:true,
                video_id
            });

            const video = await Video.findByPk(video_id);
            if (video) {
                await video.increment('views', { by: 1 });
            }
            return responseObject(
                req,
                res,
                "",
                responseCode.OK,
                true,
                responseMessage.VIDEO_COUNT_UPDATED_SUCCESSFULLY
            );
        }

        return responseObject(
            req,
            res,
            "",
            responseCode.OK,
            true,
            ""
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
    handlerUpdateVideoCount
}