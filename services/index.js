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

module.exports.getFills = (exchange) => {
  return new Promise((resolve, reject) => {
    exchange.authedClient.getFills({product_id: exchange.product}, (err, resp, data) => {
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

module.exports.websocket = {
  // Socket open
  open: (exchange, event) => {
    let result;
    const websocket = exchange.websocket;
    // If the socket is closed, reconnect
    if (!websocket.socket || websocket.socket.readyState === 3) {
      websocket.connect();
      result = 'Socket connected!';
    } else {
      result = 'Socket was already connected';
    }
    console.log('-----------------------------------');
    console.log(result);
    console.log('-----------------------------------');
    return Promise.resolve(websocket);
  },
  // Socket close
  close: (exchange) => {
    let result;
    const websocket = exchange.websocket;
    // If the socket is open, close it
    if (websocket.socket && websocket.socket.readyState === 1) {
      websocket.disconnect();
      result = 'Socket disconnected!';
    } else {
      result = 'Socket was already disconnected';
    }
    console.log('-----------------------------------');
    console.log(result);
    console.log('-----------------------------------');
    return Promise.resolve(websocket);
  }
}
