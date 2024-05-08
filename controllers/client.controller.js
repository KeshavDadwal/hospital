const {responseObject,paginationResponseObject} = require("../helpers/responseCode");
const {responseCode} = require("../helpers/statusCode");
const Client  = require('../models/client');


async function handlerCreateClient(req, res) {
    try {
        if (!req.file) {
            return responseObject(
                req,
                res,
                "",
                responseCode.BAD_REQUEST,
                false,
                "Please upload an image"
            );
        }
        
        const { company_id} = req.decodedToken;
        const { firstname, lastname, joining_date,email } = req.body;
        const picture = req.file.originalname;
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
                "CLIENT_CREATED_SUCCESSFULLY"
            );
        } else {
            console.log("errr",err)
            return responseObject(
                req,
                res,
                "",
                responseCode.INTERNAL_SERVER_ERROR,
                true,
                "SOMETHING_WENT_WRONG"
            );
        }
    } catch (err) {
        console.log("errr1212",err)
        return responseObject(
            req,
            res,
            "",
            responseCode.INTERNAL_SERVER_ERROR,
            false,
            "SOMETHING_WENT_WRONG"
        );
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
            return paginationResponseObject(
                req,
                res,
                clients,
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
                "NO DATA FOUND"
            );
        }
    } catch (err) {
        return responseObject(
            req,
            res,
            "",
            responseCode.INTERNAL_SERVER_ERROR,
            false,
            "SOMETHING_WENT_WRONG"
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
                "CLIENT NOT FOUND"
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
            "SOMETHING_WENT_WRONG"
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
                "Please upload an image"
            );
        }

        const { company_id} = req.decodedToken;
        const clientId = req.params.id; 
        const {firstname, lastname, joining_date,email } = req.body;
        const picture = req.file.originalname;
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
                "CLIENT NOT FOUND"
            );
        }

        await client.update({
            company_id,
            picture,
            firstname,
            lastname,
            email,
            joining_date
        });

        return responseObject(
            req,
            res,
            client,
            responseCode.OK,
            true,
            "CLIENT_UPDATED_SUCCESSFULLY"
        );
    } catch (err) {
        return responseObject(
            req,
            res,
            "",
            responseCode.INTERNAL_SERVER_ERROR,
            false,
            "SOMETHING_WENT_WRONG"
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
                "CLIENT NOT FOUND"
            );
        }

        await client.destroy();

        return responseObject(
            req,
            res,
            "",
            responseCode.OK,
            true,
            "CLIENT_DELETED_SUCCESSFULLY"
        );
    } catch (err) {
        return responseObject(
            req,
            res,
            "",
            responseCode.INTERNAL_SERVER_ERROR,
            false,
            "SOMETHING_WENT_WRONG"
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
