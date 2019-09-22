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

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'ssl0.ovh.net',
      port: 993,
      secure: false, // true for 465, false for other ports
      auth: {
        user: keys.senderEmail, // generated ethereal user
        pass: keys.senderEmailPassword, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <' + keys.senderEmail + '>', // sender address
      to: keys.recipientEmail, // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: '<b>Hello world?</b>', // html body
    });
    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    // var transporter = nodemailer.createTransport({
    //   service: 'ssl0.ovh.net',
    //   auth: {
    //     user: 'zakaria@zakariaothmane.fr',
    //     pass: 'mohamedabdallah',
    //   },
    // });
    // var mailOptions = {
    //   from: 'zakaria@zakariaothmane.fr',
    //   to: 'othmane.zakaria79@gmail.com',
    //   subject: 'Sending Email using Node.js',
    //   text: 'That was easy!',
    // };
    // transporter.sendMail(mailOptions, function(error, info) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log('Email sent: ' + info.response);
    //   }
    // });
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
