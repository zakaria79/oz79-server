var express = require('express');
var router = express.Router();

router.get('*', ({res}) => res.render('index'));

module.exports = router;
