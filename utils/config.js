const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const DB_ADRESS = 'mongodb://localhost:27017/bitfilmsdb';

module.exports = {
  limiter,
  DB_ADRESS,
};
