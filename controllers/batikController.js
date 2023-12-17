const express = require("express");
const BatikService = require('../services/firestore/BatikService');
const ClientError = require("../exceptions/ClientError");
const NotFoundError = require("../exceptions/NotFoundError");


const batikService = new BatikService();

const getAllBatik = async (req, res) => {
  try {
    const allBatik = await batikService.getAllBatik();

    res.status(200).json({
      status: "success",
      error: false,
      data: allBatik,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getBatikById = async (req, res) => {
  try {
    const batikId = req.params.id;
    const batik = await batikService.getBatikById(batikId);
    if(!batik) throw new NotFoundError('Batik tidak ditemukan');

    res.status(200).json({
      status: "success",
      error: false,
      data: batik,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const postBatik = async (req, res) => {
  try {
    const { title, origin, description, imageUrl } = req.body;
    const batikId = await batikService.postBatik(title, origin, description, imageUrl);

    res.status(201).json({
      status: "success",
      error: false,
      data: batikId,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const deleteBatik = async (req, res) => {
  try {
    const batik = await batikService.deleteAllBatik();

    res.status(204).json({
      status: "success",
      error: false,
      data: batik,
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
  getAllBatik,
  getBatikById,
  postBatik,
  deleteBatik,
};
