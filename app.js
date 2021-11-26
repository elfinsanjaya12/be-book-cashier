const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const categoriesRouter = require('./app/api/categories/router');
const authRouter = require('./app/api/auth/router');
const productsRouter = require('./app/api/products/router');
const uploadsRouter = require('./app/api/uploads/router');
const transactionsRouter = require('./app/api/transactions/router');
const dashboardsRouter = require('./app/api/dashboard/router');
const dotenv = require('dotenv');
const cors = require('cors');

const URL = '/api/v1';
const app = express();

dotenv.config();

// middleware
const notFoundMiddleware = require('./app/middlewares/not-found');
const errorHandlerMiddleware = require('./app/middlewares/error-handler');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(`${URL}/categories`, categoriesRouter);
app.use(`${URL}/auth`, authRouter);
app.use(`${URL}/products`, productsRouter);
app.use(`${URL}/uploads`, uploadsRouter);
app.use(`${URL}/transactions`, transactionsRouter);
app.use(`${URL}/dashboards`, dashboardsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
