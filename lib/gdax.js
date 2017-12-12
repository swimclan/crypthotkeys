var Gdax = require('gdax');

const apiURI = process.env.API_URI;
const sandboxURI = process.env.SANDBOX_URI;
const key = process.env.API_KEY;
const secret = process.env.API_SECRET;
const passphrase = process.env.API_PASSPHRASE;

class Exchange {
  constructor(pair) {
    this.publicClient = new Gdax.PublicClient(pair);
    this.authedClient = new Gdax.AuthenticatedClient(key, secret, passphrase, apiURI);
    this.websocket = new Gdax.WebsocketClient([pair]);
  }
}

var instance;

module.exports.getInstance = (pair) => {
  if (!instance) {
    return new Exchange(pair);
  }
  return instance;
}
