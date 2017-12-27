var Gdax = require('gdax');
var config = require('../config');

const apiURI = config.get(`api.${process.env.NODE_ENV}.url`);
const webSocketURI = config.get(`websocket.${process.env.NODE_ENV}.url`);
const key = process.env.API_KEY;
const secret = process.env.API_SECRET;
const passphrase = process.env.API_PASSPHRASE;

class Exchange {
  constructor(product) {
    this.product = product;
    this.publicClient = new Gdax.PublicClient(product);
    this.authedClient = new Gdax.AuthenticatedClient(key, secret, passphrase, apiURI);
    this.websocket =  new Gdax.WebsocketClient([product], webSocketURI, null, { heartbeat: false, channels: ['ticker'] });
    this.authedClient.productID = product;
    console.log('------------------NEW GDAX INSTANCE--------------------');
    console.log(this);
    console.log('-------------------------------------------------------');
  }
}

var instance;

module.exports.getInstance = (product) => {
  if (!instance || product !== instance.product) {
    instance = new Exchange(product);
  }
  return instance;
}
