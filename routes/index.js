var express = require('express');
var router = express.Router();
var controllers = require('../controllers');

/* GET Accounts */
router.get('/accounts', controllers.getAccounts);

/* GET Account */
router.get('/account/:id', controllers.getAccount);

module.exports = router;
