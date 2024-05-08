const {responseObject,paginationResponseObject} = require("../helpers/responseCode");
const {responseCode} = require("../helpers/statusCode");
const sendEmail = require("../helpers/mail");
const generateRandomString = require('../helpers/randomString');
const bcrypt = require('bcrypt');
const Carer  = require('../models/carer');
const CarerLogin  = require('../models/carerLogin');
const jwt = require('jsonwebtoken');


async function handlerCreateCarer(req, res) {
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
        let { blocked } = req.body; 
        let password = generateRandomString(8);
        const hashedPassword = await bcrypt.hash(password, 10);
        const picture = req.file.originalname;

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
            sendEmail(email, password); 
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
                "CARER_CREATED_SUCCESSFULLY"
            );
        } else {
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
                "CARER NOT FOUND"
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
            "SOMETHING_WENT_WRONG"
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
                "Please upload an image"
            );
        }

        const { company_id} = req.decodedToken;
        const carerId = req.params.id; 
        const {firstname, lastname, joining_date,email } = req.body;
        let { blocked } = req.body; 
        blocked = blocked === null || blocked === undefined ? false : blocked;
        const picture = req.file.originalname;
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
                "CARER NOT FOUND"
            );
        }

        await carer.update({
            company_id,
            picture,
            firstname,
            lastname,
            email,
            joining_date,
            blocked
        });

        return responseObject(
            req,
            res,
            carer,
            responseCode.OK,
            true,
            "CARER_UPDATED_SUCCESSFULLY"
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
                "CARER NOT FOUND"
            );
        }

        await carer.destroy();

        return responseObject(
            req,
            res,
            "",
            responseCode.OK,
            true,
            "CARER_DELETED_SUCCESSFULLY"
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
                        "CARER LOGIN_SUCCESSFULLY"
                    );
                }
            } else {
                return responseObject(
                    req,
                    res,
                    "",
                    responseCode.UNAUTHORIZED,
                    true,
                    "USERNAME_OR_PASSWORD_INVALID"
                );
            }
        } else {
            return responseObject(
                req,
                res,
                "",
                responseCode.NOT_FOUND, 
                true,
                "COMPANY_NOT_FOUND"
            );
        }
    } catch (err) {
        console.error("Error:", err);
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
    handlerGetCarer,
    handlerCreateCarer,
    handlerDeleteCarer,
    handlerUpdateCarer,
    handlerGetCarerById,
    handlerCarerLogin
}
