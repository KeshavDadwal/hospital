const responseObject = (
    req,
    res,
    data,
    code = responseCode.OK,
    success = true,
    message = ""
  ) =>
    res.status(code).send({
    code,
    message:message,
    success:success,
    data,
  });


  const paginationResponseObject = (
    req,
    res,
    data,
    totalPages,
    page,
    pageSize,
    code = responseCode.OK,
    success = true,
    message = ""
  ) =>
    res.status(code).send({
    code,
    message:message,
    success:success,
    totalPages,
    page,
    pageSize,
    data,
  });


module.exports = { responseObject, paginationResponseObject };
