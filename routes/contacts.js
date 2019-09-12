var express = require('express');
var router = express.Router();
var {
  newContact,
  newContactValidator,
  getContacts,
  deleteContact,
} = require('./../controllers/contacts');

router.post('/', newContactValidator, newContact);
router.get('/', getContacts);
router.get('/delete/:id', deleteContact);

module.exports = router;
