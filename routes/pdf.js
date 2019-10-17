var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');

const { exec } = require('child_process');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/convert', function(req, res, next) {
  const url = req.body.url;
  exec(`wkhtmltopdf ${url} ./pdfs/file.pdf`, (err, stdout, stderr) => {
    if (err) {
      return next(err);
    }
    res.json({ error: false, message: 'ok' });
  });
});

router.get('/converted-file', function(req, res, next) {
  const pdfPath = path.join('pdfs', 'file.pdf');
  fs.readFile(pdfPath, function(err, data) {
    if (err) {
      next(err);
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="file.pdf"');
    res.send(data);
  });
});

module.exports = router;
