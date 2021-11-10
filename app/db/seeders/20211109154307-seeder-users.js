'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = bcrypt.hashSync('rahasia', 10);
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'admin codeathome',
          email: 'admin@gmail.com',
          password: password,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
