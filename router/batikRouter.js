const express = require("express");
const router = express.Router();
const {
  getAllBatik,
  getBatikById,
  postBatik,
  deleteBatik,
  } = require("../controllers/batikController");

const { upload } = require('../app');

router.get("/batik/", getAllBatik);
router.get("/batik/:id", getBatikById);
router.post("/batik/", postBatik);

module.exports = router;
