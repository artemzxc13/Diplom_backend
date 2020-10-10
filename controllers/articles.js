const mongoose = require('mongoose');
const Article = require('../models/article');
const { NotFoundError } = require('../errors/NotFoundError');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { BadRequestError } = require('../errors/BadRequestError');

const createArticle = (async (req, res, next) => {
  try {
    const {
      keyword, title, text, date, source, link, image,
    } = req.body;
    const article = await Article.create({
      keyword, title, text, date, source, link, image, owner: req.user._id,
    });
    return res.status(201).send({ data: article });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError(err.message));
    }
    return next(err);
  }
});

const getArticles = (async (req, res, next) => {
  try {
    const articles = await Article.find({})
      .sort({ createdAt: -1 });
    return res.status(200).send({ data: articles });
  } catch (err) {
    return next(err);
  }
});

const deleteArticle = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.articleId)) {
    return Article.findById(req.params.articleId)
      .select('owner')
      .orFail(new NotFoundError({ message: 'Статья с этим id не найдена' }))
      .then((article) => {
        if (article.owner.toString() === req.user._id) {
          return Article.deleteOne(article)
            .orFail(new NotFoundError({ message: 'Статья с этим id не найдена' }))
            .then((deletedArticle) => res.send({
              data: deletedArticle,
              message: 'Статья удалена',
            }))
            .catch(next);
        }
        return next(new ForbiddenError({ message: 'Вы не можете удалять ужие новости' }));
      })
      .catch(next);
  }
  return next(new BadRequestError({ message: 'Некорректный формат id' }));
};

module.exports = {
  createArticle,
  getArticles,
  deleteArticle,
};