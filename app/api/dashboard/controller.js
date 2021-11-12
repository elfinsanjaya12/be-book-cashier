const { Transaction, DetailTransaction, Product } = require('../../db/models');
const moment = require('moment');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../../errors');
const { Op } = require('sequelize');
const { extendMoment } = require('moment-range');
let MomentRange = extendMoment(moment);

const getDashboard = async (req, res, next) => {
  try {
    const condition = { user: req.user.userId };

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

    const bestProduct = await Product.findAll({
      where: { user: req.user.userId, sold: { [Op.gt]: 0 } },
      attributes: ['id', 'title', 'cover', 'price', 'sold'],
      order: [['sold', 'DESC']],
      limit: 4,
    });

    res
      .status(StatusCodes.OK)
      .json({ data: { chart: dataGroup, bestProduct } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };
