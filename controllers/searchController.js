const ArticlesService = require('../services/firestore/ArticlesService');
const BatikService = require('../services/firestore/BatikService');

const articlesService = new ArticlesService('articles');
const batikService = new BatikService('batik');

const ClientError = require('../exceptions/ClientError');
const NotFoundError = require('../exceptions/NotFoundError');


const searchKeyword = async (req, res) => {
  try {
    const { article, batik } = req.query;
    let searchResult;
    if(article) searchResult = await articlesService.searchArticles(article);
    if(batik) searchResult = await batikService.searchBatik(batik);
    if((!searchResult) || (searchResult.length == 0)) throw new NotFoundError('Data tidak ditemukan');
    
    return res.status(200).json({
      status: 'success',
      message: 'Berhasil mencari data',
      error: false,
      data: searchResult
    });
  } catch (error) {
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
  }
};

module.exports = searchKeyword;
