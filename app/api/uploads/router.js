const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticateUser } = require('../../middlewares/full-auth');
const upload = require('../../middlewares/multer');

router
  .route('/')
  .post(
    authenticateUser,
    upload.single('image'),
    controller.uploadProductImage
  );

module.exports = router;
