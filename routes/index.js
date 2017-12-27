var express = require('express');
var router = express.Router();
var controllers = require('../controllers');

/* GET Products */
router.get('/products', controllers.getProducts);

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

/* GET Fills */
router.get('/fills', controllers.getFills);

/* GET Cancel Order */
router.get('/cancel/:id', controllers.cancelOrder);

/* GET Ticker */
router.get('/ticker', controllers.productTicker);

/* GET Start Websocket */
router.get('/websocket/open/:event', controllers.websocketOpen);

/* GET Start Websocket */
router.get('/websocket/close/', controllers.websocketClose);

/* POST Flash trade */
router.post('/flash/:side', controllers.flashTrade);

/* POST Set stop */
router.post('/stop', controllers.setStop);

module.exports = router;
