const {responseObject,paginationResponseObject} = require("../helpers/responseCode");
const {responseCode} = require("../helpers/statusCode");
const Role  = require('../models/role');

async function handlerCreateRole(req, res) {
    try {
        
        const { name, description} = req.body;
        const newRole = await Role.create({
            name,
            description,
        });

        if (newRole) {
            return responseObject(
                req,
                res,
                newRole.dataValues,
                responseCode.OK,
                true,
                "ROLE_CREATED_SUCCESSFULLY"
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


async function handlerGetRole(req, res) {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
        const offset = (page - 1) * pageSize;

        const rolesData = await Role.findAndCountAll({ 
            attributes: ['id','name','description'],
            limit: pageSize,
            offset: offset,
            order: [['created_at', 'DESC']]
        });

        const totalCount = rolesData.count;
        const roles = rolesData.rows;

        const totalPages = Math.floor((totalCount + pageSize - 1) / pageSize)

        if (totalCount > 0) {
            return paginationResponseObject(
                req,
                res,
                roles,
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

module.exports = {
    handlerGetRole,
    handlerCreateRole
}