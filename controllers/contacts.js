const { check, body, validationResult } = require('express-validator');
const Contact = require('./../models/contact');
const nodemailer = require('nodemailer');
const keys = require('./../config/keys');

exports.newContactValidator = [
  body('email')
    .isEmail()
    .withMessage('Veuillez saisir une adresse mail valide'),
  body('message')
    .isLength({ min: 5 })
    .withMessage('Veuillez saisir votre message'),
];

exports.newContact = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return res.json(errorMessages);
  }

  const { email, message } = req.body;
  const contact = new Contact({ email, message });

  try {
    const savedContact = await contact.save();
    const transporter = nodemailer.createTransport({
      service: 'ssl0.ovh.net',
      auth: {
        user: keys.senderEmail,
        pass: keys.senderEmailPassword,
      },
    });
    const mailOptions = {
      from: keys.senderEmail,
      to: keys.recipientEmail,
      subject: 'Un nouveau contact dans oz79.fr',
      text: 'Un nouveau contact dans oz79.fr',
    };
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        return res.send(error);
      }
    });
    // res.json({ error: false, message: savedContact });
    res.json({ error: false, message: info.response });
  } catch (e) {
    /* handle error */
    res.json({
      error: true,
      message: 'Une erreur est survenue',
      errMessage: e,
    });
  }
};

exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    return res.json({ error: false, contacts });
  } catch (e) {
    /* handle error */
    res.json({ error: true, message: e });
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    const result = await Contact.deleteOne({ _id: req.params.id });
    if (result.n === 1) {
      return res.json({ error: false, message: 'Contact supprimé' });
    }
    return res.json({ error: true, message: 'Une erreur est survenue' });
  } catch (e) {
    /* handle error */
    res.json({ error: true, message: 'Une erreur est survenue' });
  }
};
