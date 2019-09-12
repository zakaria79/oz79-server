var express = require('express');
var router = express.Router();
var {
  signin,
  user,
  logout,
  signinValidation,
} = require('./../controllers/users');

var User = require('./../models/user');
var bcrypt = require('bcrypt');
const {check, body} = require('express-validator');

router.get('/user', user);
router.post('/signin', signinValidation, signin);
router.get('/logout', logout);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
