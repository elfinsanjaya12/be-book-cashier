'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Transaction.hasMany(models.DetailTransaction, {
        foreignKey: 'transaction',
        as: 'detailTransaction',
      });
    }
  }
  Transaction.init(
    {
      invoice: DataTypes.STRING,
      date: DataTypes.DATE,
      user: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Transaction',
    }
  );
  return Transaction;
};
