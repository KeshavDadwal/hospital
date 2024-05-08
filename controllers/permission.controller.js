const {responseObject,paginationResponseObject} = require("../helpers/responseCode");
const {responseCode} = require("../helpers/statusCode");
const Permission  = require('../models/permission');

async function handlerCreatePermission(req, res) {
    try {
        
        const { name, description} = req.body;
        const newPermission = await Permission.create({
            name,
            description,
        });

        if (newPermission) {
            return responseObject(
                req,
                res,
                newPermission.dataValues,
                responseCode.OK,
                true,
                "PERMISSION_CREATED_SUCCESSFULLY"
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


async function handlerGetPermission(req, res) {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
        const offset = (page - 1) * pageSize;

        const permissionData = await Permission.findAndCountAll({ 
            attributes: ['id','name','description'],
            limit: pageSize,
            offset: offset,
            order: [['created_at', 'DESC']]
        });

        const totalCount = permissionData.count;
        const permissions = permissionData.rows;

        const totalPages = Math.floor((totalCount + pageSize - 1) / pageSize)

        if (totalCount > 0) {
            return paginationResponseObject(
                req,
                res,
                permissions,
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
    handlerGetPermission,
    handlerCreatePermission
}