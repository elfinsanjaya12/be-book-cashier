const path = require('path');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../../errors');

const uploadProductImage = async (req, res, next) => {
  try {
    console.log(req.file);
    if (!req.file) {
      throw new CustomError.BadRequestError('No File Uploaded');
    }
    const productImage = req.file;
    console.log('productImage >>');
    console.log(productImage);
    if (!productImage.mimetype.startsWith('image')) {
      throw new CustomError.BadRequestError('Please Upload Image');
    }
    const maxSize = 1024 * 1024;
    if (productImage.size > maxSize) {
      throw new CustomError.BadRequestError('Please upload image smaller 1MB');
    }

    return res
      .status(StatusCodes.OK)
      .json({ image: { src: `/uploads/${productImage.filename}` } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadProductImage,
};
