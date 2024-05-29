const {responseObject,paginationResponseObject} = require("../helpers/responseCode");
const {responseCode} = require("../helpers/statusCode");
const {responseMessage} = require("../helpers/statusCodeMsg");
const Client  = require('../models/client');
const uploadImage = require('../helpers/s3bucket');
require('dotenv').config(); 


async function handlerCreateClient(req, res) {
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
        const picture = await uploadImage(req.file.path, req.file.originalname,"client");
        const newClient = await Client.create({
            company_id,
            picture,
            firstname,
            lastname,
            email,
            joining_date
        });

        if (newClient) {
            return responseObject(
                req,
                res,
                newClient.dataValues,
                responseCode.OK,
                true,
                responseMessage.CLIENT_CREATED_SUCCESSFULLY
            );
        } else {
            return responseObject(
                req,
                res,
                "",
                responseCode.INTERNAL_SERVER_ERROR,
                true,
                responseMessage.UNABLE_TO_CREATE_THE_COMPANY
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

async function handlerGetClient(req, res) {
    try {
        const { company_id} = req.decodedToken;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
        const offset = (page - 1) * pageSize;

        const clientsData = await Client.findAndCountAll({ 
            where: { company_id: company_id },
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

async function handlerGetClientById(req,res) {
    try {
        const { company_id} = req.decodedToken;
        const clientId = req.params.id; 
        const client = await Client.findOne({
            where: {
              id: clientId,
              company_id: company_id
            }
          });
        
        if (!client) {
            return responseObject(
                req,
                res,
                "",
                responseCode.NOT_FOUND,
                false,
                responseMessage.CLIENT_NOT_FOUND
            );
        }
        if (client) {
            return responseObject(
                req,
                res,
                client,
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

async function handlerUpdateClient(req, res) {
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
        const clientId = req.params.id; 
        const {firstname, lastname} = req.body;
        const picture = await uploadImage(req.file.path, req.file.originalname,"client");
        const client = await Client.findOne({
            where: {
              id: clientId,
              company_id: company_id
            }
          });

        if (!client) {
            return responseObject(
                req,
                res,
                "",
                responseCode.NOT_FOUND,
                false,
                responseMessage.CLIENT_NOT_FOUND
            );
        }

        await client.update({
            company_id,
            picture,
            firstname,
            lastname,
        });

        return responseObject(
            req,
            res,
            client,
            responseCode.OK,
            true,
            responseMessage.CLIENT_UPDATED_SUCCESSFULLY
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

async function handlerDeleteClient(req, res) {
    try {
        const clientId = req.params.id; 
        const { company_id} = req.decodedToken;
        const client = await Client.findOne({
            where: {
              id: clientId,
              company_id: company_id
            }
          });

        if (!client) {
            return responseObject(
                req,
                res,
                "",
                responseCode.NOT_FOUND,
                false,
               responseMessage.CLIENT_NOT_FOUND
            );
        }

        await client.destroy();

        return responseObject(
            req,
            res,
            "",
            responseCode.OK,
            true,
            responseMessage.CLIENT_DELETED_SUCCESSFULLY
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
    handlerGetClient,
    handlerCreateClient,
    handlerDeleteClient,
    handlerUpdateClient,
    handlerGetClientById
}
