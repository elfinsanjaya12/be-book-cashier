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
      title: DataTypes.STRING,
      auhtor: DataTypes.STRING,
      cover: DataTypes.STRING,
      published: DataTypes.DATE,
      price: DataTypes.FLOAT,
      stock: DataTypes.INTEGER,
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
