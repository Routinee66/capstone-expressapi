const express = require('express');
const router = express.Router();
const searchKeyword = require('../controllers/searchController');

router.get('/search', searchKeyword);

module.exports = router;
