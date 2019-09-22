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

    let testAccount = await nodemailer.createTestAccount();

    var transporter = nodemailer.createTransport({
      host: keys.emailHost,
      port: emailPort,
      // secure: false,
      auth: {
        user: keys.senderEmail,
        pass: keys.senderEmailPassword,
      },
    });
    var mailOptions = {
      from: keys.senderEmail,
      to: keys.recipientEmail,
      subject: 'Nouveau contact sur oz79.fr',
      text: `De : ${email}<br />Message:<br />${message}`,
    };
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.json({ error: false, message: savedContact });
  } catch (e) {
    /* handle error */ return res.json({
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
    /* handle error */ res.json({ error: true, message: e });
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
    /* handle error */ res.json({
      error: true,
      message: 'Une erreur est survenue',
    });
  }
};
