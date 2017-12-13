var get = require('lodash').get;

let config = {
  trading: {
    product: 'ETH-BTC',
    increment: 0.00001,
    sigDig: 5,
    fraction: 1
  },
  api: {
    production: {
      url: 'https://api.gdax.com'
    },
    development: {
      url: 'https://api-public.sandbox.gdax.com'
    }
  }
}

module.exports.get = (path) => {
  return get(config, path);
}
