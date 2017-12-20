var gdax = require('../lib/gdax');
var config = require('../config');

module.exports.trade = (exchange, side, price, size) => {
  return new Promise((resolve, reject) => {
    let params = {
      price: price,
      size: size,
      product_id: exchange.product
    }
    switch (side) {
      case 'buy':
        exchange.authedClient.buy(params, (err, resp, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        });
        break;
      case 'sell':
        exchange.authedClient.sell(params, (err, resp, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        });
        break;
    }
  });
}

module.exports.productTicker = (exchange) => {
  return new Promise((resolve, reject) => {
    exchange.publicClient.getProductTicker((err, resp, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

module.exports.cancelOrder = (exchange, orderid) => {
  return new Promise((resolve, reject) => {
    exchange.authedClient.cancelOrder(orderid, (err, resp, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

module.exports.cancelOrders = (exchange, product) => {
  return new Promise((resolve, reject) => {
    let options = product ? {product_id: product} : {};
    exchange.authedClient.cancelAllOrders(options, (err, resp, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

module.exports.getOrder = (exchange, id) => {
  return new Promise((resolve, reject) => {
    exchange.authedClient.getOrder(id, (err, resp, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

module.exports.getOrders = (exchange) => {
  return new Promise((resolve, reject) => {
    exchange.authedClient.getOrders((err, resp, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

module.exports.getAccount = (exchange, id) => {
  return new Promise((resolve, reject) => {
    exchange.authedClient.getAccount(id, (err, resp, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

module.exports.getAccounts = (exchange) => {
  return new Promise((resolve, reject) => {
    exchange.authedClient.getAccounts((err, resp, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

module.exports.getProducts = (exchange) => {
  return new Promise((resolve, reject) => {
    exchange.publicClient.getProducts((err, resp, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

module.exports.websocket = (exchange, event) => {
  const websocket = exchange.websocket;
  websocket.on(event, (data) => {
    (data.type === 'open') && data.reason !== 'canceled' && data.price ? console.log(data.price) : null
  });
  return Promise.resolve({result: 'Websocket connected'});
}
