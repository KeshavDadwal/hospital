const {responseObject,paginationResponseObject} = require("../helpers/responseCode");
const {responseCode} = require("../helpers/statusCode");
const {responseMessage} = require("../helpers/statusCodeMsg");
const Client  = require('../models/client');
const Carer  = require('../models/carer');
const uploadImage = require('../helpers/s3bucket');
require('dotenv').config(); 


async function handlerGetMobileClient(req, res) {
    try {

        const { carer_id} = req.decodedToken;
        
            const companyData = await Carer.findAndCountAll({ 
                where: { id: carer_id },
                attributes: ['company_id'],
                limit: 1 
            });

        const companyId = companyData.rows.length > 0 ? companyData.rows[0].company_id : null;
    
        console.log("companyId id ",companyId)
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
        const offset = (page - 1) * pageSize;

        const clientsData = await Client.findAndCountAll({ 
            where: { company_id: companyId },
            attributes: ['id', 'picture', 'firstname', 'lastname', 'joining_date','email'],
            limit: pageSize,
            offset: offset,
            order: [['created_at', 'DESC']]
        });

        const totalCount = clientsData.count;
        const clients = clientsData.rows;

        const totalPages = Math.floor((totalCount + pageSize - 1) / pageSize)

        if (totalCount > 0) {

            clients.forEach(client => {
    
                client.picture = process.env.BUCKET_URL+"/" + client.picture;
            });

            return paginationResponseObject(
                req,
                res,
                clients,
                totalPages,
                page,
                pageSize,
                responseCode.OK,
                true,
                responseMessage.CLIENT_CREATED_SUCCESSFULLY
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
        console.log("daataayayya=====",err)
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
    handlerGetMobileClient
}