const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticateUser } = require('../../middlewares/full-auth');

router
  .route('/')
  .get(authenticateUser, controller.getAllProducts)
  .post(authenticateUser, controller.createProducts);

router
  .route('/:id')
  .get(authenticateUser, controller.getOneProducts)
  .put(authenticateUser, controller.updateProducts)
  .delete(authenticateUser, controller.deleteProducts);

module.exports = router;
