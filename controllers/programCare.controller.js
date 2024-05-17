const {responseObject} = require("../helpers/responseCode");
const {responseCode} = require("../helpers/statusCode");
const {responseMessage} = require("../helpers/statusCodeMsg");
const ProgramCare  = require('../models/programCare');
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
        console.log("errr====",err)
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
        const { client_id, program_care_id, arr } = req.body;

        let newEntries;

        if (Array.isArray(arr) && arr.length > 1) {
            // Prepare bulk insert data
            const bulkData = arr.map(item => ({
                company_id,
                client_id: client_id,
                program_care_id: program_care_id,
                description: item.description
            }));
            newEntries = await ProgramCareData.bulkCreate(bulkData);
        } else {
            // Single insert
            newEntries = await ProgramCareData.create({
                company_id,
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
            console.log("rqwerqwerwerwer12312312",err)
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
        console.log("rqwerqwerwerwer",err)
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

module.exports={
    handlerGetProgramCare,
    handlerCreateProgramCare
}