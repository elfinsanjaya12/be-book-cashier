'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init(
    {
      title: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'Please enter your title' },
        },
      },
      auhtor: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'Please enter your auhtor' },
        },
      },
      cover: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'Please enter your cover' },
        },
      },
      published: {
        type: DataTypes.DATE,
        validate: {
          notEmpty: { msg: 'Please enter your published' },
          isDate: { msg: 'Please enter your date' },
        },
      },
      price: {
        type: DataTypes.FLOAT,
        validate: {
          notEmpty: { msg: 'Please enter your price' },
          isNumeric: { msg: 'Please enter your price is number' },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: { msg: 'Please enter your stock' },
          isNumeric: { msg: 'Please enter your stock is number' },
        },
      },
      user: DataTypes.INTEGER,
      category: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Product',
    }
  );

  return Product;
};
