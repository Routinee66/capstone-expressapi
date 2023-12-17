// const express = require("express");
const BookmarkService = require('../services/firestore/BookmarksService');
const ClientError = require("../exceptions/ClientError");
const { firestore } = require('firebase-admin');

const bookmarkService = new BookmarkService();

const getBookmarkByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const data = await bookmarkService.getBookmarkByUsername(username);
    res.status(200).json({
      status: "success",
      error: false,
      data: data,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getBookmarkArticlesByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const data = await bookmarkService.getBookmarkArticlesByUsername(username);
    res.status(200).json({
      status: "success",
      error: false,
      data: data,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getBookmarkBatikByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const data = await bookmarkService.getBookmarkBatikByUsername(username);
    res.status(200).json({
      status: "success",
      error: false,
      data: data,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const postBookmark = async (req, res) => {
  try {
    const username = req.headers['username'] || req.body.username;
    const contentId = req.body.contentId;
    const contentType = contentId.split('-')[0];

    await bookmarkService.postBookmark(username, contentId);

    let updatedBookmark;
    if(contentType === 'article'){
      updatedBookmark = await bookmarkService.getBookmarkArticlesByUsername(username);
    } else if(contentType === 'batik'){
      updatedBookmark = await bookmarkService.getBookmarkBatikByUsername(username);
      
    }

    res.status(201).json({
      status: "success",
      error: false,
      message: "Bookmark berhasil ditambahkan",
      data: updatedBookmark
    });
  } catch (error) {
    handleError(res, error);
  }
};

const deleteBookmark = async (req, res) => {
  try {
    const { username, contentId } = req.params;

    await bookmarkService.deleteBookmarkById(username, contentId);
    res.status(200).json({
      status: "success",
      error: false,
      message: "Bookmark berhasil dihapus"
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
    res.status(400).json({
      status: "error",
      error: true,
      message: error.message,
    });
  }
};

module.exports = {
  getBookmarkByUsername,
  getBookmarkArticlesByUsername,
  getBookmarkBatikByUsername,
  postBookmark,
  deleteBookmark
};
