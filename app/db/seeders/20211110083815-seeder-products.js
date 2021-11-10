'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Products',
      [
        {
          title: 'David Bach: Faktor Latte',
          auhtor: 'David Bach',
          cover: '/uploads/image 1.png',
          published: new Date(),
          price: 90,
          stock: 100,
          user: 1,
          category: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: '"Selena" dan "Nebula"',
          auhtor: 'TERE LIYE',
          cover: '/uploads/image 2.png',
          published: new Date(),
          price: 90,
          stock: 100,
          user: 1,
          category: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Pelukis Bisu (The Silent Patient)',
          auhtor: 'Alex Michaelides',
          cover: '/uploads/image 3.png',
          published: new Date(),
          price: 90,
          stock: 100,
          user: 1,
          category: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Kecamuk Darah (Troubled Blood)',
          auhtor: 'Robert Galbraith',
          cover: '/uploads/image 4.png',
          published: new Date(),
          price: 90,
          stock: 100,
          user: 1,
          category: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Kitab Kawin (Edisi Cover Baru)',
          auhtor: ' Laksmi Pamuntjak',
          cover: '/uploads/image 5.png',
          published: new Date(),
          price: 90,
          stock: 100,
          user: 1,
          category: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Salvation of a Saint',
          auhtor: 'Keigo Higashino',
          cover: '/uploads/image 6.png',
          published: new Date(),
          price: 90,
          stock: 100,
          user: 1,
          category: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  },
};
