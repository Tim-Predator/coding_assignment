const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const { ENV } = require('../../config/vars');

const handler = (err, req, res, next) => {
  const response = {
    status: err.status,
    errno: err.errno,
    success: false,
    message: err.message||err.name,
    stack: err.stack,
  };

  if (ENV !== 'development') {
    delete response.stack;
  }

  res.status(err.status);
  res.json(response);
  res.end();
};
exports.handler = handler;

exports.converter = (err, req, res, next) => {
  let convertedError = err;

  if (!(err instanceof APIError)) {
    convertedError = new APIError({
      status: err.status,
      errno: 40000,
      message: `${JSON.stringify(err.errors)}`,
      success: false,
      stack: err.stack,
    });
  }
  return handler(convertedError, req, res);
};

exports.notFound = (req, res, next) => {
  const err = new APIError({
      status:  httpStatus.NOT_FOUND,
      errno: 40400,
      message: 'Not found/ Invalid URL',
      success: false,
  });
  return handler(err, req, res);
};
