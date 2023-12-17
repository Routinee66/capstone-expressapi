// app.js
const express = require('express');
const bodyParser = require('body-parser');
const articlesRouter = require('./router/articlesRouter');
const batikRouter = require('./router/batikRouter');
const bookmarkRouter = require('./router/bookmarkRouter');
const searchRouter = require('./router/searchRouter');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer();
const app = express();
app.use(bodyParser.json());
app.use(upload.array());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', articlesRouter); 
app.use('/api', batikRouter); 
app.use('/api', bookmarkRouter); 
app.use('/api', searchRouter); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
