const { serverErrorMessage } = require('../errors/ErrorMessages');

module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  console.log(message);
  res.status(statusCode).send({
    message: statusCode === 500 ? serverErrorMessage : message,
  });
  next();
};
