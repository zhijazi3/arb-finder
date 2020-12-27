const kyberMainnet = require('./kyber-mainnet.json');
const uniswapMainnet = require('./uniswap-mainnet.json');
const dydxMainnet = require('./dydx-mainnet.json');
const tokensMainnet = require('./tokens-mainnet.json');
const honeyswapMannet = require('./honeyswap-mainnet.json');

module.exports = {
  mainnet: {
    kyber: kyberMainnet,
    uniswap: uniswapMainnet, 
    honeyswap: honeyswapMannet,
    dydx: dydxMainnet,
    tokens: tokensMainnet
  }
};
