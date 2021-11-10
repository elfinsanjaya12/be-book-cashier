'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Categories',
      [
        {
          name: 'Business & Economics',
          user: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Art & Design',
          user: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Agriculture',
          user: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  },
};
