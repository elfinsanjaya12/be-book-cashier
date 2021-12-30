const { Category } = require('../../db/models');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../../errors');
const { Op } = require('sequelize');

const getAllCategories = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const { limit = 5 } = req.query;

    const categories = await Category.findAll({
      where: { user: userId },
      attributes: ['id', 'name'],
      limit: Number(limit),
    });

    res.status(StatusCodes.OK).json({ data: categories });
  } catch (err) {
    next(err);
  }
};

const createCategories = async (req, res, next) => {
  try {
    const { name } = req.body;
    let user = req.user.userId;

    const chekcingName = await Category.findOne({ where: { name, user } });

    if (chekcingName) throw new BadRequestError('duplicate name');

    const categories = await Category.create({ name, user });

    res.status(StatusCodes.CREATED).json({ data: categories });
  } catch (err) {
    next(err);
  }
};

const getOneCategories = async (req, res, next) => {
  try {
    let user = req.user.userId;
    let { id } = req.params;

    const categories = await Category.findOne({ where: { id, user } });

    if (!categories) {
      throw new NotFoundError(`No category with id : ${id} and user : ${user}`);
    }

    res.status(StatusCodes.OK).json({ data: categories });
  } catch (err) {
    next(err);
  }
};

const updateCategories = async (req, res, next) => {
  try {
    const { name } = req.body;
    let user = req.user.userId;
    let id = req.params.id;

    const checkingCategory = await Category.findOne({ where: { id, user } });

    if (!checkingCategory)
      throw new NotFoundError(`No category with id : ${id} and user : ${user}`);

    const chekcingCategoryName = await Category.findOne({
      where: { name, user, id: { [Op.ne]: id } },
    });

    if (chekcingCategoryName) {
      throw new BadRequestError('duplicate name');
    }

    checkingCategory.name = name;
    await checkingCategory.save();

    res.status(StatusCodes.OK).json({ data: checkingCategory });
  } catch (err) {
    next(err);
  }
};
const deleteCategories = async (req, res, next) => {
  try {
    let user = req.user.userId;
    let id = req.params.id;

    const checkingCategory = await Category.findOne({ where: { id, user } });

    if (!checkingCategory)
      throw new NotFoundError(`No category with id : ${id} and user : ${user}`);

    await checkingCategory.destroy();

    res.status(StatusCodes.OK).json({ data: checkingCategory });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCategories,
  createCategories,
  getOneCategories,
  updateCategories,
  deleteCategories,
};
