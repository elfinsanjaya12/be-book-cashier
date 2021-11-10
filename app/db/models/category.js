'use strict';
const { Model } = require('sequelize');
const CustomError = require('../../errors');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'Please enter your name' },
        },
      },
      user: {
        type: DataTypes.STRING,
      },
    },

    {
      sequelize,
      modelName: 'Category',
    }
  );

  Category.addHook('beforeCreate', async (category, options) => {
    const checking = await sequelize.models.User.findOne({
      where: { id: category.user },
    });
    if (!checking)
      return Promise.reject(
        new CustomError.NotFoundError(`No user with id ${category.user}`)
      );
  });

  return Category;
};
