const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { key } = require('../datadb/jwt');
const { NotFoundError } = require('../errors/NotFoundError');
const { ConflictError } = require('../errors/ConflictError');
const { BadRequestError } = require('../errors/BadRequestError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      data: {
        name: user.name,
        email: user.email,
      },
    }))
    .catch((err) => {
      let error;
      if (err.name === 'ValidationError') {
        if (err.errors.email && err.errors.email.kind === 'unique') {
          error = new ConflictError();
          return next(error);
        }
        error = new BadRequestError('Переданы некорректные данные');
      }
      return next(error);
    });
};

const login = (req, res, next) => User.findUserByCredentials(req.body.email, req.body.password)
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, key, { expiresIn: '7d' });
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: 'strict',
    })
      .send({ message: 'Вход выполнен' })
      .end();
  })
  .catch(() => next(new UnauthorizedError('Ошибка авторизации')));

const getUser = (req, res, next) => {
  console.log();
  User.findById(req.user._id)
    .orFail(new NotFoundError({ message: 'Пользователь не найден' }))
    .then((user) => res.send({ name: user.name, email: user.email }))
    .catch(next);
};

module.exports = { createUser, login, getUser };
