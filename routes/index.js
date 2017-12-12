var express = require('express');
var router = express.Router();
var controllers = require('../controllers');

/* GET Account Profile. */
router.get('/accounts', controllers.getAccounts);

module.exports = router;
