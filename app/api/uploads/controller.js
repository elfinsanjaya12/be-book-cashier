const fs = require('fs');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../../errors');
const cloudinary = require('cloudinary').v2;

const uploadImageCloudinary = async (req, res, next) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path);
    res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const uploadProductImage = async (req, res, next) => {
  try {
    console.log(req.file);
    if (!req.file) {
      throw new CustomError.BadRequestError('No File Uploaded');
    }
    const productImage = req.file;

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
  uploadImageCloudinary,
};
