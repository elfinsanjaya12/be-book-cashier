const { Product, Category } = require('../../db/models');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../../errors');
const { Op } = require('sequelize');

const getAllProducts = async (req, res, next) => {
  try {
    const { userId } = req.user;
    let { limit = 5, keyword = '', category = '' } = req.query;

    let condition = {
      user: userId,
    };

    if (keyword !== '') {
      condition = { ...condition, title: { [Op.like]: `%${keyword}%` } };
    }

    if (category !== '') {
      condition = { ...condition, category: Number(category) };
    }

    const products = await Product.findAll({
      where: condition,
      limit: Number(limit),
    });

    res.status(StatusCodes.OK).json({ data: products });
  } catch (err) {
    next(err);
  }
};

const createProducts = async (req, res, next) => {
  try {
    let user = req.user.userId;
    const { title, auhtor, published, price, stock, category, cover } =
      req.body;

    const checkingCategory = await Category.findOne({
      where: { id: category, user: user },
    });

    if (!checkingCategory)
      throw new NotFoundError(`No category with id : ${id} and user : ${user}`);

    const chekcingName = await Product.findOne({
      where: { title, user: user },
    });

    if (chekcingName) throw new BadRequestError('duplicate title');

    const products = await Product.create({
      title,
      auhtor,
      published,
      price,
      stock,
      cover,
      category,
      user: user,
    });

    res.status(StatusCodes.CREATED).json({ data: products });
  } catch (err) {
    next(err);
  }
};

const getOneProducts = async (req, res, next) => {
  try {
    let user = req.user.userId;
    const { id } = req.params;

    const checkingProduct = await Product.findOne({
      where: { id: id, user: user },
    });

    if (!checkingProduct)
      throw new NotFoundError(`No product with id : ${id} and user : ${user}`);

    res.status(StatusCodes.OK).json({ data: checkingProduct });
  } catch (err) {
    next(err);
  }
};

const updateProducts = async (req, res, next) => {
  try {
    const user = req.user.userId;
    const { id } = req.params;
    const { title, auhtor, published, price, stock, category, cover } =
      req.body;

    const checkingCategory = await Category.findOne({
      where: { id: category, user: user },
    });

    if (!checkingCategory)
      throw new NotFoundError(`No category with id : ${id} and user : ${user}`);

    const checkingProduct = await Product.findOne({
      where: { id, user: user },
    });

    if (!checkingProduct)
      throw new NotFoundError(`No product with id : ${id} and user : ${user}`);

    const chekcingProductName = await Product.findOne({
      where: { title, user: user, id: { [Op.ne]: id } },
    });

    if (chekcingProductName) {
      throw new BadRequestError('duplicate name');
    }

    checkingProduct.title = title;
    checkingProduct.auhtor = auhtor;
    checkingProduct.published = published;
    checkingProduct.price = price;
    checkingProduct.stock = stock;
    checkingProduct.cover = cover;

    await checkingProduct.save();

    res.status(StatusCodes.OK).json({ data: checkingProduct });
  } catch (err) {
    next(err);
  }
};

const deleteProducts = async (req, res, next) => {
  try {
    let user = req.user.userId;
    let id = req.params.id;

    const checkingProduct = await Product.findOne({ where: { id, user } });

    if (!checkingProduct)
      throw new NotFoundError(`No product with id : ${id} and user : ${user}`);

    await checkingProduct.destroy();

    res.status(StatusCodes.OK).json({ data: checkingProduct });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  createProducts,
  getOneProducts,
  updateProducts,
  deleteProducts,
};
