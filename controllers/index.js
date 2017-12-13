var get = require('lodash').get;
var config = require('../config');
var services = require('../services');
var tools = require('../tools');

module.exports.getAccounts = (req, res, next) => {
  services.getAccounts().then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}

module.exports.getAccount = (req, res, next) => {
  services.getAccount(req.params.id).then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}

module.exports.getOrders = (req, res, next) => {
  services.getOrders().then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}

module.exports.getOrder = (req, res, next) => {
  services.getOrder(req.params.id).then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}

module.exports.cancelOrders = (req, res, next) => {
  let product = get(req.body, 'product_id', null);
  services.cancelOrders(product).then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}

module.exports.cancelOrder = (req, res, next) => {
  services.cancelOrder(req.params.id).then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}

module.exports.productTicker = (req, res, next) => {
  services.productTicker().then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}

module.exports.websocket = (req, res, next) => {
  services.websocket().then((result) => {
    res.status(200).json(result);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}

module.exports.flashTrade = (req, res, next) => {
  let side = req.params.side;
  Promise.all([services.productTicker(), services.getAccounts()])
  .then(([lastTick, accounts]) => {
    let params = tools.calcTrade(
      side,
      config.get('trading.fraction'),
      config.get('trading.product'),
      accounts,
      config.get('trading.increment'),
      config.get('trading.sigDig'),
      lastTick
    );
    return services.trade(side, params.price, params.size);
  }).catch((err) => {
    res.status(500).json({error: err});
  }).then((trade) => {
    res.status(200).json(trade);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}
