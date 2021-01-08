require('dotenv').config()
const { ChainId, Token, Fetcher } =  require('@uniswap/sdk');

const chainId = ChainId.MAINNET
const tokenAddress = '0xd26114cd6ee289accf82350c8d8487fedb8a0c07' // must be checksummed


const utils = require('./kyber_utils.js');
/*
(async () => {
function getKyberTokens(callback) {
  utils.getKyberTokens(function(kyber_list) {
    callback(kyber_list)
  });
}
console.table(await getKyberTokens())
})();
*/

// Create a web3 isntance and connect to peronal infura node
const Web3 = require('web3');
const web3 = new Web3(
  new Web3.providers.WebsocketProvider(process.env.UNI_RPC_URL)
);

// Fix checksum warning
function toChecksum(address){
  return Web3.utils.toChecksumAddress(address);
}

var uni_list = {};

function Token(token) {
  this.name = token.name;
  this.address = token.address;
  this.buy = 0;
  this.sell = 0;
  this.spot = 0;
}

function addToken(token) {
  tokens.kyber[token.symbol] = new Token(token)

}

(async () => {
function getUniTokens(existing_list, callback){  
  for (let token in existing_list.kyber){
    (async () => {
      try {
      const token = await Token.fetchData(chainId, toChecksum(existing_list.kyber[token].address))
      addToken(token)
    } catch (err) {console.log(`failed token! ${token}`)}

    })();
}
callback(uni_list)
}
console.log('done')
})
})();
