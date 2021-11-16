module.exports = {
  development: {
    username: 'root',
    password: null,
    database: 'db_book-cashier',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'aabplqahhuiclx',
    password:
      'c8ac7b987326263811ef8727396291574ea8667ba3126edba617f5b377f102c3',
    database: 'd7qliesevp73nv',
    host: 'ec2-34-198-189-252.compute-1.amazonaws.com',
    post: 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  },
};
