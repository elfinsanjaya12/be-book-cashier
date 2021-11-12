const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticateUser } = require('../../middlewares/full-auth');

router.route('/').get(authenticateUser, controller.getDashboard);

module.exports = router;
