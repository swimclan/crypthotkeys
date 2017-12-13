var Gdax = require('gdax');
var config = require('../config');

const apiURI = config.get(`api.${process.env.NODE_ENV}.url`);
const key = process.env.API_KEY;
const secret = process.env.API_SECRET;
const passphrase = process.env.API_PASSPHRASE;

class Exchange {
  constructor(product) {
    this.product = product;
    this.publicClient = new Gdax.PublicClient(product);
    this.authedClient = new Gdax.AuthenticatedClient(key, secret, passphrase, apiURI);
    this.websocket = new Gdax.WebsocketClient([product]);
  }
}

var instance;

module.exports.getInstance = (pair) => {
  if (!instance) {
    return new Exchange(pair);
  }
  return instance;
}
