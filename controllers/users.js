const User = require('./../models/user');
const { userAdmin } = require('./../config/data');
const bcrypt = require('bcrypt');
const { validationResult, check, body } = require('express-validator');

exports.user = (req, res, next) => {
  if (req.session.user) {
    return res.json(req.session.user);
  }
  res.json({ error: true, message: 'Utilisateur non connecté' });
};

exports.signinValidation = [
  check('login', 'Identifiant introuvable')
    .isLength({ min: 5 })
    .custom((value, { req }) => {
      return User.findOne({ login: value }).then(userDoc => {
        if (!userDoc || !bcrypt.compare(value, userDoc.password)) {
          return Promise.reject('Identifiants introuvables');
        }

        req.session.user = userDoc;
        req.session.user.isLoggedIn = true;

        return true;
      });
      return true;
    }),
  body('password', 'Veuillez saisir un mot de passe valide').isLength({
    min: 5,
  }),
];

exports.signin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ error: true, errors: errors.array() });
  }

  if (req.session.user && req.session.user.isLoggedIn) {
    res.json(req.session.user);
  }

  res.json({ error: true, message: 'Identifiants incorectes' });
};

exports.logout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      res.json({ error: true });
    }
    res.json({ error: false });
  });
};
