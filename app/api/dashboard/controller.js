const { Transaction, DetailTransaction, Product } = require('../../db/models');
const moment = require('moment');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../../errors');
const { Op } = require('sequelize');
const { extendMoment } = require('moment-range');
let MomentRange = extendMoment(moment);
const sequelize = require('../../db/models').sequelize;

const getDashboard = async (req, res, next) => {
  try {
    /** Chart 1 minggu */
    const user = req.user.userId;
    const condition = { user: user };

    let startDate = moment().startOf('week').toDate();
    let endDate = moment().endOf('week').toDate();

    condition.date = { [Op.between]: [startDate, endDate] };

    const result = await Transaction.findAll({
      where: condition,
      include: {
        model: DetailTransaction,
        as: 'detailTransaction',
      },
    });

    const range = MomentRange.range(startDate, endDate);

    const hours = Array.from(range.by('days'));
    const groups = {};

    hours.map((m) => {
      const timeHour = m.format('DD/MM/YYYY');
      groups[timeHour] = new Array();
    });

    const groupArray = [];
    for (let i = 0; i < result.length; i++) {
      const _date = moment(result[i].date).format('DD/MM/YYYY');

      groupArray.push({
        x: _date,
        y: result[i].detailTransaction.reduce((a, b) => a + b.priceProduct, 0),
      });
    }

    var tmp = {};
    const dataGroup = [];
    groupArray.forEach(function (item) {
      var obj = (tmp[item.x] = tmp[item.x] || { total: 0 });
      obj.total += item.y;
    });

    Object.entries(tmp).map(function (entry) {
      console.log(entry);
      groups[entry[0]].push({
        x: entry[0],
        y: entry[1].total,
      });
    });

    for (const [key, item] of Object.entries(groups)) {
      dataGroup.push({
        x: key,
        y: item.length > 0 ? item[0].y : 0,
      });
    }

    /* penjualan terlaris */
    const bestProduct = await DetailTransaction.findAll({
      include: {
        model: Transaction,
        attributes: [],
        where: { user: user },
      },

      group: [
        'DetailTransaction.productHistoryId',
        'DetailTransaction.titleProduct',
      ],

      attributes: [
        'titleProduct',
        'priceProduct',
        'coverImage',
        [sequelize.fn('sum', sequelize.col('quantity')), 'total_quantity'],
      ],
      order: [['quantity', 'DESC']],
      limit: 4,
    });

    const bestMonth = await DetailTransaction.findAll({
      include: {
        model: Transaction,
        attributes: [],
        where: {
          user: user,
          date: {
            [Op.between]: [
              moment().startOf('month').toDate(),
              moment().endOf('month').toDate(),
            ],
          },
        },
      },

      group: [
        'DetailTransaction.productHistoryId',
        'DetailTransaction.titleProduct',
      ],

      attributes: [
        'titleProduct',
        'priceProduct',
        [sequelize.fn('sum', sequelize.col('quantity')), 'total_quantity'],
      ],
      order: [['quantity', 'DESC']],
    });

    res
      .status(StatusCodes.OK)
      .json({ data: { chart: dataGroup, bestProduct, bestMonth } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };
