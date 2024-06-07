const {responseObject} = require("../helpers/responseCode");
const {responseCode} = require("../helpers/statusCode");
const {responseMessage} = require("../helpers/statusCodeMsg");
const ProgramCare  = require('../models/programCare');
const Video = require("../models/video")
const ProgramCareData  = require('../models/programCareData');

async function handlerGetProgramCare(req, res) {
    try {
        const clientsData = await ProgramCare.findAndCountAll({
            attributes: ['id', 'title'],
            order: [['created_at', 'ASC']]
        });

        const totalCount = clientsData.count;

        if (totalCount > 0) {
            return responseObject(
                req,
                res,
                clientsData.rows,
                responseCode.OK,
                true,
                responseMessage.DATA_FETCHED_SUCCESSFULLY
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

async function handlerCreateProgramCare(req, res) {
    try {
        const { company_id } = req.decodedToken;
        const { client_id, program_care_id, arr, video_id } = req.body;

        let newEntries;

        if (Array.isArray(arr) && arr.length > 1) {
            // Prepare bulk insert data
            const bulkData = arr.map(item => ({
                company_id,
                video_id,
                client_id: client_id,
                program_care_id: program_care_id,
                description: item.description
            }));
            newEntries = await ProgramCareData.bulkCreate(bulkData);
        } else {
            // Single insert
            newEntries = await ProgramCareData.create({
                company_id,
                video_id,
                client_id,
                program_care_id,
                description:arr[0].description
            });
        }

        if (newEntries) {
            return responseObject(
                req,
                res,
                Array.isArray(newEntries) ? newEntries.map(entry => entry.dataValues) : newEntries.dataValues,
                responseCode.OK,
                true,
                responseMessage.PROGRAM_CARE_CREATED_SUCCESSFULLY
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

async function handlerUpdateProgramCare(req, res) {
    try {
        const { company_id } = req.decodedToken;
        const pocId = req.params.id; 
        const { video_id,description, } = req.body;
       
        const pocData = await ProgramCareData.findOne({
            where: {
              id: pocId,
              company_id: company_id
            }
          });

        if (!pocData) {
            return responseObject(
                req,
                res,
                "",
                responseCode.NOT_FOUND,
                false,
                responseMessage.POC_NOT_FOUND
            );
        }

        const newdescription = description === "" ? pocData.dataValues.description:description
        const newVideoId = video_id == null ? pocData.dataValues.video_id:video_id

        await pocData.update({
            company_id,
            video_id:newVideoId,
            description:newdescription
        });

        return responseObject(
            req,
            res,
            pocData,
            responseCode.OK,
            true,
            responseMessage.POC_UPDATED_SUCCESSFULLY
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

async function handlerGetPOCBYID(req, res) {
    try {
        const { client } = req.query;
        if (!client) {
            return res.status(400).json({
                success: false,
                message: "client_id is required"
            });
        }

        const pocValues = [1, 2, 3, 4];
        const pocDataPromises = pocValues.map(async poc => {
            const pocData = await ProgramCareData.findAndCountAll({
                attributes: [
                    'id',
                    'client_id',
                    'video_id',
                    'company_id',
                    'program_care_id',
                    'description',
                    'created_at',
                    'updated_at'
                ],
                where: {
                    client_id: client,
                    program_care_id: poc,
                },
                include: [
                    {
                        model: ProgramCare,
                        attributes: ['title'],
                        required: false
                    },
                    {
                        model: Video,
                        attributes: ['title', 'video_path','id'],
                        required: false
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            return pocData;
        });

        const pocDatas = await Promise.all(pocDataPromises);

        let totalCount = 0;
        let allRows = [];
        pocDatas.forEach(pocData => {
            totalCount += pocData.count;
            allRows = allRows.concat(pocData.rows);
        });

        allRows.forEach(data => {
            if (data.Video) {
                data.Video.video_path = process.env.BUCKET_URL + "/" + data.Video.video_path;
            }
        });


        if (totalCount > 0) {
            return responseObject(
                req,
                res,
                allRows,
                responseCode.OK,
                false,
                responseMessage.POC_FOUND
            );
        } else {
            return responseObject(
                req,
                res,
                "",
                responseCode.OK,
                false,
                responseMessage.NO_DATA_FOUND
            );
        }
    } catch (err) {
        console.error(err);
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



module.exports={
    handlerGetProgramCare,
    handlerCreateProgramCare,
    handlerGetPOCBYID,
    handlerUpdateProgramCare
}