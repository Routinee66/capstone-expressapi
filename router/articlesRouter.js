const express = require("express");
const router = express.Router();
const {
  getArticles,
  getArticleById,
  postArticle,
} = require("../controllers/articleController");

const { upload } = require('../app');

router.get("/articles/", getArticles);
router.get("/articles/:id", getArticleById);
router.post("/articles/", postArticle);

module.exports = router;
