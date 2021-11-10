const jwt = require('jsonwebtoken');

const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret');
  return token;
};

const isTokenValid = (token) =>
  jwt.verify(token, process.env.JWT_SECRET || 'secret');

module.exports = {
  createJWT,
  isTokenValid,
};
