require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { celebrate, errors, Joi } = require('celebrate');
const cookeParser = require('cookie-parser');
const {
  db, HOST, PORT, data,
} = require('./datadb/base');
const { NotFoundError } = require('./errors/NotFoundError');
const { serverHandler } = require('./middlewares/serverHandler');
const { requestsLogger, errorsLogger } = require('./middlewares/logger');
const { createUser, login } = require('./controllers/users');
const { userRouter, articleRouter } = require('./routes/index.js');
const auth = require('./middlewares/auth');
const { rateLimita } = require('./middlewares/rateLimiter');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookeParser());
mongoose.connect(data, db)
  .then(() => console.log('Соединение с БД установлено:', (data)))
  .catch(() => new Error('Ошибка соединения с БД:'));
app.use(requestsLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .pattern(/^[a-zA-Zа-яА-ЯёЁ -]*$/),
    email: Joi.string().required().email(),
    password: Joi.string().alphanum()
      .min(8)
      .max(16)
      .required(),
  }),
}), createUser);
app.use(auth);
app.use('/users', rateLimita, userRouter);
app.use('/articles', articleRouter);

app.use(errorsLogger);
app.use(errors());

app.use('*', (req, res, next) => {
  next(new NotFoundError('Ресурс не найден.'));
});
app.use(serverHandler);

app.listen(PORT, () => {
  console.log(`Веб сервер работает по адресу: ${(HOST)}:${(PORT)}`);
});
