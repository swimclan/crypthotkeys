var get = require('lodash').get;

let config = {
  trading: {
    product: 'LTC-BTC',
    increment: 0.00001,
    sigDig: 5,
    fraction: 1,
    fee: 0.003
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
