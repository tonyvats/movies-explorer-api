require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const router = require('./routes/index');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const errorHandler = require('./middlewares/ErrorHandler');
const { limiter, DB_ADRESS_DEV } = require('./utils/config');

const { PORT = 3000, NODE_ENV, MONGO_URL } = process.env;

const app = express();

app.use(cors());

// mongoose.connect(DB_ADRESS, {
mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : DB_ADRESS_DEV, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use('/', router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
