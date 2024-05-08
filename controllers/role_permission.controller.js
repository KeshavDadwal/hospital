const {responseObject,paginationResponseObject} = require("../helpers/responseCode");
const {responseCode} = require("../helpers/statusCode");
const Role_Permission  = require('../models/role_permission');

async function handlerCreateRolePermission(req, res) {
    try {
        
        const { role_id, permission_id} = req.body;
        const newRolePermission = await Role_Permission.create({
            role_id,
            permission_id,
        });

        if (newRolePermission) {
            return responseObject(
                req,
                res,
                newRolePermission.dataValues,
                responseCode.OK,
                true,
                "ROLE_PERMISSION_CREATED_SUCCESSFULLY"
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


async function handlerGetRolePermission(req, res) {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
        const offset = (page - 1) * pageSize;

        const rolepermissionData = await Role_Permission.findAndCountAll({ 
            attributes: ['id','role_id','permission_id'],
            limit: pageSize,
            offset: offset,
            order: [['created_at', 'DESC']]
        });

        const totalCount = rolepermissionData.count;
        const role_permissions = rolepermissionData.rows;

        const totalPages = Math.floor((totalCount + pageSize - 1) / pageSize)

        if (totalCount > 0) {
            return paginationResponseObject(
                req,
                res,
                role_permissions,
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
    handlerGetRolePermission,
    handlerCreateRolePermission
}