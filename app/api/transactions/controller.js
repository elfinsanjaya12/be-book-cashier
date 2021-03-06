const { Transaction, DetailTransaction, Product } = require('../../db/models');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../../errors');
const { Op } = require('sequelize');
const sequelize = require('../../db/models').sequelize;

const getAllTransactions = async (req, res, next) => {
  try {
    const user = req.user.userId;
    let { keyword = '' } = req.query;

    let condition = {
      user: user,
    };

    if (keyword !== '') {
      condition = { ...condition, invoice: { [Op.like]: `%${keyword}%` } };
    }

    const transactions = await Transaction.findAll({
      where: condition,
      attributes: ['id', 'invoice', 'date', 'user'],
      include: {
        model: DetailTransaction,
        as: 'detailTransaction',
      },
    });

    res.status(StatusCodes.OK).json({ data: transactions });
  } catch (err) {
    next(err);
  }
};

const getDetailTransactions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user.userId;
    let condition = {
      id: id,
      user: user,
    };

    const transactions = await Transaction.findAll({
      where: condition,
      attributes: ['id', 'invoice', 'date'],
      include: {
        model: DetailTransaction,
        as: 'detailTransaction',
        attributes: [
          'id',
          'titleProduct',
          'auhtorProduct',
          'quantity',
          'priceProduct',
        ],
      },
    });

    res.status(StatusCodes.OK).json({ data: transactions });
  } catch (err) {
    next(err);
  }
};

const createTransactions = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { payload } = req.body;
    console.log('req.user');
    console.log(req.user);
    const user = req.user.userId;

    const transaction = await Transaction.create(
      {
        invoice: `T-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date(),
        user: user,
      },
      { transaction: t }
    );

    let errorProductIdNotFound = [];
    let errorProductIdStock = [];
    let updateStock = [];
    for (let i = 0; i < payload.length; i++) {
      const checkingProduct = await Product.findOne({
        where: { id: payload[i].productId, user: user },
      });

      payload[i].transaction = transaction.id;
      payload[i].productHistoryId = checkingProduct.id;
      payload[i].titleProduct = checkingProduct.title;
      payload[i].auhtorProduct = checkingProduct.auhtor;
      payload[i].coverImage = checkingProduct.cover;
      payload[i].priceProduct = checkingProduct.price;

      updateStock.push({
        id: payload[i].productId,
        stock: checkingProduct.stock - payload[i].quantity,
        sold: checkingProduct.sold
          ? checkingProduct.sold + payload[i].quantity
          : payload[i].quantity,
        title: checkingProduct.title,
        auhtor: checkingProduct.auhtor,
        cover: checkingProduct.cover,
        price: checkingProduct.price,
      });

      if (payload[i].quantity > checkingProduct.stock) {
        errorProductIdStock.push(
          `${payload[i].quantity} - ${checkingProduct.stock}`
        );
      }

      if (!checkingProduct) {
        errorProductIdNotFound.push(payload[i].productId);
      }
    }

    if (errorProductIdNotFound.length !== 0) {
      throw new NotFoundError(
        `No product with id : ${errorProductIdNotFound.join(
          ', '
        )} and user : ${user}`
      );
    }

    if (errorProductIdStock.length !== 0) {
      throw new BadRequestError(
        `product stock is not enough with id : ${errorProductIdStock.join(
          ', '
        )}  and user : ${user}`
      );
    }

    await Product.bulkCreate(
      updateStock,
      {
        updateOnDuplicate: ['stock', 'sold'],
      },
      { transaction: t }
    );

    const detailTransaction = await DetailTransaction.bulkCreate(payload, {
      transaction: t,
    });

    await t.commit();

    res.status(StatusCodes.OK).json({ data: detailTransaction });
  } catch (err) {
    if (t) await t.rollback();

    next(err);
  }
};

module.exports = {
  getAllTransactions,
  createTransactions,
  getDetailTransactions,
};
