const {responseObject,paginationResponseObject} = require("../helpers/responseCode");
const {responseCode} = require("../helpers/statusCode");
const {responseMessage} = require("../helpers/statusCodeMsg");
const Company  = require('../models/company');
const {GenerateRandomString} = require('../helpers/randomString')
const {sendEmail} = require("../helpers/mail");
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');


async function handlerCreateCompany(req, res) {
    try {
        const { name, email, phone, address, website } = req.body;
        const role_id = 1;

        let password = GenerateRandomString(8);
        const hashedPassword = await bcrypt.hash(password, 10);
        const company = await Company.create({
            name,
            role_id,
            email,
            phone,
            address,
            website,
            password: hashedPassword,
        });

        
        const responseData = { ...company.dataValues };
        delete responseData.password;

        if (company) {
            await sendEmail(email, password);
            return responseObject(
                req,
                res,
                responseData,
                responseCode.OK,
                true,
                responseMessage.COMPANY_CREATED_SUCCESSFULLY
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


async function handlerResetCompanyPassword(req, res) {
    try {
        const { email, password, 
         } = req.body;
        const newPasswordHash = await bcrypt.hash(new_password, 10);

        const existingCompany = await Company.findOne({ where: { email: email } });

        if (existingCompany) {
            const isPasswordMatch = await bcrypt.compare(password, existingCompany.password);

            if (isPasswordMatch) {
                await existingCompany.update({ password: newPasswordHash });
                return responseObject(
                    req,
                    res,
                    "",
                    responseCode.OK,
                    true,
                    responseMessage.PASSWORD_RESET_SUCCESSFULLY
                );
            } else {
                return responseObject(
                    req,
                    res,
                    "",
                    responseCode.UNAUTHORIZED, 
                    true,
                    responseMessage.INVALID_PASSWORD
                );
            }
        } else {
            return responseObject(
                req,
                res,
                "",
                responseCode.NOT_FOUND, 
                true,
                responseMessage.COMPANY_NOT_FOUND
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


async function handlerCompanyLogin(req, res) {
    try {
        const { email, password } = req.body;
        const existingCompany = await Company.findOne({ where: { email: email } });

        if (existingCompany) {
            
            const isPasswordMatch = await bcrypt.compare(password, existingCompany.password);
            if (isPasswordMatch) {
                
                const token = jwt.sign(
                    { company_id: existingCompany.id, email: existingCompany.email, role_id: existingCompany.role_id },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '10h' }
                );

                return responseObject(
                    req,
                    res,
                    { token: token },
                    responseCode.OK,
                    true,
                    responseMessage.LOGIN_SUCCESSFULLY
                );
            } else {
                return responseObject(
                    req,
                    res,
                    "",
                    responseCode.UNAUTHORIZED,
                    false,
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
                responseMessage.UNABLE_TO_FIND_THE_COMPANY
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

module.exports = {
    handlerCreateCompany,
    handlerResetCompanyPassword,
    handlerCompanyLogin,
}