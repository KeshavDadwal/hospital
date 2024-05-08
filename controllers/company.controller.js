const {responseObject,paginationResponseObject} = require("../helpers/responseCode");
const {responseCode} = require("../helpers/statusCode");
const Company  = require('../models/company');
const generateRandomString = require('../helpers/randomString');
const sendEmail = require("../helpers/mail");
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

async function handlerCreateCompany(req, res) {
    try {
        const { name, email, phone, address, website } = req.body;
        const role_id = 2;

        let password = generateRandomString(8);
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

        if (company) {
            sendEmail(email,password);
            return responseObject(
                req,
                res,
                company.dataValues,
                responseCode.OK,
                true,
                "COMPANY_CREATED_SUCCESSFULLY"
            );
        } else {
            console.log("error",err);
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
        console.log("error1",err);
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
                    "PASSWORD_RESET_SUCCESSFULLY"
                );
            } else {
                return responseObject(
                    req,
                    res,
                    "",
                    responseCode.UNAUTHORIZED, 
                    true,
                    "INVALID_PASSWORD"
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
                    "LOGIN_SUCCESSFULLY"
                );
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
    handlerCreateCompany,
    handlerResetCompanyPassword,
    handlerCompanyLogin,
}