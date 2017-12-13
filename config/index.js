var get = require('lodash').get;

let config = {
  trading: {
    currency: 'ETH-BTC'
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
