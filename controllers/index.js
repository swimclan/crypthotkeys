var get = require('lodash').get;
var config = require('../config');
var services = require('../services');
var tools = require('../tools');

module.exports.getProducts = (req, res, next) => {
  services.getProducts(req.app.locals.exchange).then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}

module.exports.getAccounts = (req, res, next) => {
  services.getAccounts(req.app.locals.exchange).then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}

module.exports.getAccount = (req, res, next) => {
  services.getAccount(req.app.locals.exchange, req.params.id).then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}

module.exports.getOrders = (req, res, next) => {
  services.getOrders(req.app.locals.exchange).then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}

module.exports.getOrder = (req, res, next) => {
  services.getOrder(req.app.locals.exchange, req.params.id).then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}

module.exports.cancelOrders = (req, res, next) => {
  let product = get(req.body, 'product_id', null);
  services.cancelOrders(req.app.locals.exchange, product).then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}

module.exports.cancelOrder = (req, res, next) => {
  services.cancelOrder(req.app.locals.exchange, req.params.id).then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}

module.exports.productTicker = (req, res, next) => {
  services.productTicker(req.app.locals.exchange).then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}

module.exports.websocket = (req, res, next) => {
  let event = req.params.event;
  services.websocket(req.app.locals.exchange, event).then((result) => {
    res.status(200).json(result);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}

module.exports.flashTrade = (req, res, next) => {
  let side = req.params.side;
  let exchange = req.body.product ? req.app.locals.setExchange(req.body.product) : req.app.locals.exchange;
  Promise.all([services.productTicker(exchange), services.getAccounts(exchange)])
  .then(([lastTick, accounts]) => {
    let params = tools.calcTrade(
      side,
      req.body.fraction || config.get('trading.fraction'),
      req.body.product || config.get('trading.product'),
      accounts,
      req.body.increment || config.get('trading.increment'),
      config.get('trading.fee'),
      config.get('trading.sigDig'),
      lastTick
    );
    return services.trade(exchange, side, params.price, params.size);
  }).catch((err) => {
    res.status(500).json({error: err});
  }).then((trade) => {
    res.status(200).json(trade);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}
