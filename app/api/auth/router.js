const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/signin', controller.signin);

module.exports = router;
