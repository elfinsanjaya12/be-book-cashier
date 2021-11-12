'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DetailTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DetailTransaction.belongsTo(models.Transaction, {
        foreignKey: 'transaction',
      });
    }
  }
  DetailTransaction.init(
    {
      productHistoryId: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: { msg: 'Please enter your productHistoryId' },
          isNumeric: { msg: 'harus number' },
        },
      },
      titleProduct: DataTypes.STRING,
      auhtorProduct: DataTypes.STRING,
      coverImage: DataTypes.STRING,
      priceProduct: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      transaction: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'DetailTransaction',
    }
  );
  return DetailTransaction;
};
