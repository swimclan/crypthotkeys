var get = require('lodash').get;

let config = {
  trading: {
    product: 'BCH-USD',
    increment: 0.01,
    sigDig: 5,
    fraction: 1,
    fee: 0.003,
    stop: {
      margin: 0.005
    }
  },
  api: {
    production: {
      url: 'https://api.gdax.com'
    },
    development: {
      url: 'https://api-public.sandbox.gdax.com'
    }
  },
  websocket: {
    production: {
      url: 'wss://ws-feed.gdax.com'
    },
    development: {
      url: 'wss://ws-feed.gdax.com'
    }
  }
}

module.exports.get = (path) => {
  return get(config, path);
}
