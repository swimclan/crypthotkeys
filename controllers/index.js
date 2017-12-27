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

module.exports.getFills = (req, res, next) => {
  services.getFills(req.app.locals.exchange).then((data) => {
    res.status(200).json(data);
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}

module.exports.cancelOrders = (req, res, next) => {
  let product = get(req.body, 'product_id', null);
  let exchange = req.app.locals.exchange;
  let order;
  services.cancelOrders(exchange, product).then((data) => {
    order = data;
    return services.websocket.close(exchange);
  }).then((socket) => {
    console.log('CANCEL ORDER: WEBSOCKET CLOSED');
    res.status(200).json(order);
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

module.exports.websocketOpen = (req, res, next) => {
  let event = req.params.event || 'message';
  services.websocket.open(req.app.locals.exchange, event).then((socket) => {
    res.status(200).json({message: 'socket opened'});
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}

module.exports.websocketClose = (req, res, next) => {
  services.websocket.close(req.app.locals.exchange).then((socket) => {
    res.status(200).json({message: 'socket closed'});
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

module.exports.setStop = (req, res, next) => {
  let fraction = req.body.fraction ? Number(req.body.fraction) : config.get('trading.fraction');
  let margin = req.body.margin ? Number(req.body.margin) : config.get('trading.stop.margin');
  let exchange = req.app.locals.exchange;
  Promise.all([services.getAccounts(exchange), services.websocket.open(exchange, 'message'), services.getFills(exchange)])
  .then(([accounts, websocket, fills]) => {
    let cost = tools.calcCost(accounts, fills, exchange.product);
    let stopLoss = cost.price / (1 + margin);
    let stopped = false;
    websocket.on('message', (tick) => {
      if (tools.checkStop(tick, cost.price, margin) && !stopped) {
        // Set stopped to true so no further action is taken after first time
        stopped = true;
        // Cancel orders
        services.cancelOrders(exchange, exchange.product).then((data) => {
          console.log('SELL STOP LOSS: CANCEL ORDERS');
          console.log(data);
          // Sell at the best bid price
          return services.trade(exchange, 'sell', tick.best_bid, cost.size);
        }).then((data) => {
          console.log('SELL STOP LOSS: TRADE');
          console.log(data);
          // Close websocket
          return services.websocket.close(exchange);
        }).then((socket) => {
          console.log('SELL STOP LOSS: CLOSE WEBSOCKET');
        }).catch((err) => {
          console.log(err);
        });
      }
    });
    res.status(200).json({message: `Stop loss successfully set at ${stopLoss}`});
  }).catch((err) => {
    res.status(500).json({error: err});
  });
}


