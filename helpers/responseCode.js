const responseObject = (success, message, data = null, statusCode = 200) => {
    return {
        success: success,
        message: message,
        data: data
    };
};

const paginationResponseObject = (success, message, data, totalPages, currentPage, statusCode = 200) => {
    return {
        success: success,
        message: message,
        data: data,
        pagination: {
            totalPages: totalPages,
            currentPage: currentPage
        }
    };
};

module.exports = { responseObject, paginationResponseObject };
