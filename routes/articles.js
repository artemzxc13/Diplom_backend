const router = require('express').Router();
const { createArticle, getArticles, deleteArticle } = require('../controllers/articles');

router.post('/', createArticle);
router.get('/', getArticles);
router.delete('/:articleId', deleteArticle);

module.exports = router;
