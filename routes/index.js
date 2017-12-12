var express = require('express');
var router = express.Router();
var controllers = require('../controllers');

/* GET Accounts */
router.get('/accounts', controllers.getAccounts);

/* GET Account */
router.get('/account/:id', controllers.getAccount);

/* GET Orders */
router.get('/orders', controllers.getOrders);

/* GET Order */
router.get('/order/:id', controllers.getOrder);

/* DELETE Orders */
router.delete('/orders', controllers.cancelOrders);

/* GET Cancel Order */
router.get('/cancel/:id', controllers.cancelOrder);

module.exports = router;
