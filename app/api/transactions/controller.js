const { Transaction, DetailTransaction, Product } = require('../../db/models');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../../errors');
const { Op } = require('sequelize');
const sequelize = require('../../db/models').sequelize;

const getAllTransactions = async (req, res, next) => {
  try {
    const { userId } = req.user;
    let { keyword = '' } = req.query;

    let condition = {
      user: userId,
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
const getOneTransactions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    let condition = {
      id: id,
      user: userId,
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
    const { userId } = req.user;

    const transaction = await Transaction.create(
      {
        invoice: `T-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date(),
        user: req.user.userId,
      },
      { transaction: t }
    );

    let errorProductIdNotFound = [];
    let errorProductIdStock = [];
    let updateStock = [];
    for (let i = 0; i < payload.length; i++) {
      const checkingProduct = await Product.findOne({
        where: { id: payload[i].productId, user: userId },
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
        `id product not found : ${errorProductIdNotFound.join(', ')}`
      );
    }

    if (errorProductIdStock.length !== 0) {
      throw new BadRequestError(
        `stock tidak cukup id ${errorProductIdStock.join(', ')}`
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

module.exports = { getAllTransactions, createTransactions, getOneTransactions };
