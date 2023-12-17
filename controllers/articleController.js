const express = require("express");
const ArticlesService = require('../services/firestore/ArticlesService');
const ClientError = require("../exceptions/ClientError");
const NotFoundError = require("../exceptions/NotFoundError");

const articlesService = new ArticlesService();

const getArticles = async (req, res) => {
  try {
    const allArticles = await articlesService.getArticles();

    res.status(200).json({
      status: "success",
      error: false,
      data: allArticles,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getArticleById = async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await articlesService.getArticleById(articleId);
    if(!article) throw new NotFoundError('Artikel tidak ditemukan');
    res.status(200).json({
      status: "success",
      error: false,
      data: article,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const postArticle = async (req, res) => {
  try {
    const { title, author, content, imageUrl } = req.body;
    const articleId = await articlesService.postArticles(title, author, content, imageUrl);

    res.status(201).json({
      status: "success",
      error: false,
      data: articleId,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const deleteArticles = async (req, res) => {
  try {
    const articles = await articlesService.deleteAllArticles();

    res.status(204).json({
      status: "success",
      error: false,
      data: articles,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const handleError = (res, error) => {
  if (error instanceof ClientError) {
    res.status(error.statusCode).json({
      status: "error",
      error: true,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      error: true,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getArticles,
  getArticleById,
  postArticle,
  deleteArticles,
};
