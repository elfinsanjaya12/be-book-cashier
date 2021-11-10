const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const categoriesRouter = require('./app/api/categories/router');
const authRouter = require('./app/api/auth/router');
const dotenv = require('dotenv');

const URL = '/api/v1';
const app = express();

dotenv.config();

// middleware
const notFoundMiddleware = require('./app/middlewares/not-found');
const errorHandlerMiddleware = require('./app/middlewares/error-handler');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(`${URL}/categories`, categoriesRouter);
app.use(`${URL}/auth`, authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
