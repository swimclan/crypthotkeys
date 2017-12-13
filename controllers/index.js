var gdax = require('../lib/gdax');
var get = require('lodash').get;
var config = require('../config');

const exchange = gdax.getInstance(config.get('trading.currency'));

module.exports.getAccounts = (req, res, next) => {
  exchange.authedClient.getAccounts((err, resp, data) => {
    if (err) {
      return res.status(500).json({error: err});
    }
    return res.status(200).json(data);
  });
}

module.exports.getAccount = (req, res, next) => {
  exchange.authedClient.getAccount(req.params.id, (err, resp, data) => {
    if (err) {
      return res.status(500).json({error: err});
    }
    return res.status(200).json(data);
  });
}

module.exports.getOrders = (req, res, next) => {
  exchange.authedClient.getOrders((err, resp, data) => {
    if (err) {
      return res.status(500).json({error: err});
    }
    return res.status(200).json(data);
  });
}

module.exports.getOrder = (req, res, next) => {
  exchange.authedClient.getOrder(req.params.id, (err, resp, data) => {
    if (err) {
      return res.status(500).json({error: err});
    }
    return res.status(200).json(data);
  });
}

module.exports.cancelOrders = (req, res, next) => {
  let product = get(req.body, 'product_id', null);
  let options = product ? {product_id: product} : {};
  exchange.authedClient.cancelAllOrders(options, (err, resp, data) => {
    if (err) {
      return res.status(500).json({error: err});
    }
    return res.status(200).json(data);
  });
}

module.exports.cancelOrder = (req, res, next) => {
  exchange.authedClient.cancelOrder(req.params.id, (err, resp, data) => {
    if (err) {
      return res.status(500).json({error: err});
    }
    return res.status(200).json(data);
  });
}

module.exports.productTicker = (req, res, next) => {
  exchange.publicClient.getProductTicker((err, resp, data) => {
    if (err) {
      return res.status(500).json({error: err});
    }
    return res.status(200).json(data);
  });
}

module.exports.websocket = (req, res, next) => {
  const websocket = exchange.websocket;
  websocket.on('message', (data) => { console.log('message', data) });
  websocket.on('open', (data) => { console.log('open', data) });
  websocket.on('close', (data) => { console.log('close', data) });
  websocket.on('error', (err) => { console.log('error', err) });
  res.status(200).json({result: 'Websocket connected'});
}
