var gdax = require('../lib/gdax');
var config = require('../config');

const exchange = gdax.getInstance(config.get('trading.currency'));

module.exports.trade = (side, price, size) => {
  return new Promise((resolve, reject) => {
    let params = {
      price: price,
      size: size,
      product_id: exchange.product
    }
    switch (side) {
      case 'buy':
        exchange.buy(params, (err, resp, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        });
        break;
      case 'sell':
        exchange.sell(params, (err, resp, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        });
        break;
    }
  });
}

module.exports.productTicker = () => {
  return new Promise((resolve, reject) => {
    exchange.publicClient.getProductTicker((err, resp, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

module.exports.cancelOrder = (orderid) => {
  return new Promise((resolve, reject) => {
    exchange.authedClient.cancelOrder(orderid, (err, resp, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

module.exports.cancelOrders = (product) => {
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

module.exports.getOrder = (id) => {
  return new Promise((resolve, reject) => {
    exchange.authedClient.getOrder(id, (err, resp, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

module.exports.getOrders = () => {
  return new Promise((resolve, reject) => {
    exchange.authedClient.getOrders((err, resp, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

module.exports.getAccount = (id) => {
  return new Promise((resolve, reject) => {
    exchange.authedClient.getAccount(id, (err, resp, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

module.exports.getAccounts = () => {
  return new Promise((resolve, reject) => {
    exchange.authedClient.getAccounts((err, resp, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

module.exports.websocket = () => {
  const websocket = exchange.websocket;
  websocket.on('message', (data) => { console.log('message', data) });
  websocket.on('open', (data) => { console.log('open', data) });
  websocket.on('close', (data) => { console.log('close', data) });
  websocket.on('error', (err) => { console.log('error', err) });
  return Promise.resolve({result: 'Websocket connected'});
}
