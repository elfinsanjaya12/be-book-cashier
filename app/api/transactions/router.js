const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticateUser } = require('../../middlewares/full-auth');

router
  .route('/')
  .get(authenticateUser, controller.getAllTransactions)
  .post(authenticateUser, controller.createTransactions);
router.route('/:id').get(authenticateUser, controller.getDetailTransactions);

module.exports = router;
