var {get, sum} = require('lodash');

module.exports.calcTrade = (side, fraction, product, accounts, increment, fee, sigDig, tick) => {
  let bid = Number(tick.bid);
  let ask = Number(tick.ask);
  let last = Number(tick.price);
  let acctsides = this.parseAccounts(product, accounts);
  let available, size, price, params;
  switch (side) {
    case 'buy':
      available = acctsides.sell.available;
      price = (ask - increment).toFixed(sigDig).toString();
      size = this.roundDownTo((available * fraction / price / (1 + fee)), sigDig).toString();
      break;
    case 'sell':
      available = acctsides.buy.available;
      size = this.roundDownTo(available * fraction, sigDig).toString();
      price = (bid + increment).toFixed(sigDig).toString();
      break;
  }
  return {
    product_id: product,
    size: size,
    price: price
  };
}

module.exports.parseAccounts = (product, accounts) => {
  let sides = product.split('-');
  let ret = {buy: null, sell: null};
  accounts.forEach((account) => {
    if (account.currency === sides[0]) {
      ret.buy = account
    } else if (account.currency === sides[1]) {
      ret.sell = account;
    }
  });
  return ret;
}

module.exports.calcCost = (accounts, fills, product) => {
  console.log('Calculating costs!');
  let acctSides = this.parseAccounts(product, accounts);
  let balance = get(acctSides, 'buy.balance', 0);
  let size = 0;
  let costs = [];
  let sizes = [];
  let currentFill;
  for (i in fills) {
    currentFill = fills[i];
    size += Number(currentFill.size);
    if (size > balance ) {
      break;
    }
    if (currentFill.side === 'buy' && currentFill.product_id === product) {
      costs.push(Number(currentFill.price) * Number(currentFill.size));
      sizes.push(Number(currentFill.size));
    }
  }
  return {
    price: this.weightedAvg(costs, sizes),
    size: balance
  };
}

module.exports.weightedAvg = (products, weights) => {
  return sum(products) / sum(weights);
}

module.exports.roundDownTo = (number, digits) => {
  let factor = Math.pow(10, digits);
  return Math.floor(number * factor) / factor;
}

module.exports.checkStop = (tick, cost, margin) => {
  let bid = Number(tick.best_bid);
  console.log(bid);
  let stopLoss = cost / (1 + margin);
  if (bid <= stopLoss) {
    return true;
  }
  return false;
}

/*
{ type: 'ticker',
  sequence: 1773778830,
  product_id: 'ETH-USD',
  price: '720.00000000',
  open_24h: '669.75000000',
  volume_24h: '205648.29025672',
  low_24h: '720.00000000',
  high_24h: '774.99000000',
  volume_30d: '10213615.17203733',
  best_bid: '719.93',
  best_ask: '720',
  side: 'buy',
  time: '2017-12-23T23:51:49.014000Z',
  trade_id: 23195365,
  last_size: '4.93805147' }
*/
