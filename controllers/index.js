var gdax = require('../lib/gdax');

const exchange = gdax.getInstance();

module.exports.getAccounts = (req, res, next) => {
  exchange.authedClient.getAccounts((err, resp, data) => {
    if (err) {
      return res.status(500).json({error: err});
    }
    return res.status(200).json(data);
  });
}

module.exports.getAccount = (req, res, next) => {
  exchange.authedClient.getAccount(req.params.id, (err, resp, data) => {
    if (err) {
      return res.status(500).json({error: err});
    }
    return res.status(200).json(data);
  });
}
