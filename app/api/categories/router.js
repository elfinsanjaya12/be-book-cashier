const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticateUser } = require('../../middlewares/full-auth');

router
  .route('/')
  .get(authenticateUser, controller.getAllCategories)
  .post(authenticateUser, controller.createCategories);

router
  .route('/:id')
  .get(authenticateUser, controller.getOneCategories)
  .put(authenticateUser, controller.updateCategories)
  .delete(authenticateUser, controller.deleteCategories);

module.exports = router;
