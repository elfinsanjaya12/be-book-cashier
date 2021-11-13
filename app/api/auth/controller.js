const { User } = require('../../db/models');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthorizedError } = require('../../errors');
const { createTokenUser, createJWT } = require('../../utils');

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError('Please provide email and password');
    }
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      throw new UnauthorizedError('Invalid Credentials');
    }
    const isPasswordCorrect = user.checkPassword(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedError('Invalid Credentials');
    }
    // compare password
    const tokenUser = createTokenUser(user);

    const token = createJWT({ user: tokenUser });

    res.status(StatusCodes.OK).json({ data: { token: token } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signin,
};
