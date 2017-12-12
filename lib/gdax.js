var Gdax = require('gdax');

const apiURI = process.env.API_URI;
const sandboxURI = process.env.SANDBOX_URI;
const key = process.env.API_KEY;
const secret = process.env.API_SECRET;
const passphrase = process.env.API_PASSPHRASE;

class Exchange {
  constructor() {
    this.publicClient = new Gdax.PublicClient();
    this.authedClient = new Gdax.AuthenticatedClient(key, secret, passphrase, apiURI);
  }
  websocket(pairs) {
    let socket = new Gdax.WebsocketClient(pairs);
    return socket;
  }
}

var instance;

module.exports.getInstance = () => {
  if (!instance) {
    return new Exchange();
  }
  return instance;
}
