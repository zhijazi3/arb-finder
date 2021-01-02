//import { legos } from "@studydefi/money-legos";
require('dotenv').config()
const kyber = require("@studydefi/money-legos/kyber");
const Web3 = require('web3');// WEB3 CONFIG

const web3 = new Web3(process.env.UNI_RPC_URL)

// import kyber and uni abos stored in abis folder
const abis = require('./abis');

// import addresses
const { mainnet: addresses } = require('./addresses');

// access ABIs and addresses
kyberAddress = kyber.network.address;
kyberAbi = kyber.network.abi;

// create pool
const network = new web3.eth.Contract(
  kyberAbi,
  kyberAddress
);


const UniRouter = new web3.eth.Contract(
  abis.uni,
  addresses.uniswap.router
);


function convertToWei(val) {
  return (val * (10 ** 18)).toString()
}

function convertFromWei(val) {
  return (val / (10 ** 18)).toString()
}


let tokens ={
//"RLC":  ['0x607F4C5BB672230e8672085532f7e901544a7375', {'kyber': [0,0,0], 'uni': [0,0,0]}]
  "LINK": ["0x514910771af9ca656af840dff83e8264ecf986ca", {'kyber': [0,0,0], 'uni': [0,0,0]}],
  "KNC":   ["0xdd974d5c2e2928dea5f71b9825b8b646686bd200", {'kyber': [0,0,0], 'uni': [0,0,0]}],
  "OMG": ["0xd26114cd6ee289accf82350c8d8487fedb8a0c07", {'kyber': [0,0,0], 'uni': [0,0,0]}],
  "SNT": ["0x744d70fdbe2ba4cf95131626614a1763df805b9e", {'kyber': [0,0,0], 'uni': [0,0,0]}]
};

async function queryKyber(name, contract){

  const results = await Promise.all([


    network
      .methods
      .getExpectedRate(
         addresses.tokens.dai,
         addresses.tokens.weth,
         web3.utils.toWei('1', 'ETHER')
    ).call(),

    // Calulate Sell
    network
       .methods
       .getExpectedRate(
         addresses.tokens.weth,
         addresses.tokens.dai,
         web3.utils.toWei('1', 'ETHER')
       )
       .call(),

    // Calulate Buy
    network
      .methods
      .getExpectedRate(
         addresses.tokens.weth,
         contract[0],
         web3.utils.toWei('.01', 'ETHER')
    ).call(),

    // Calulate Sell
    network
       .methods
       .getExpectedRate(
         contract[0],
         addresses.tokens.weth,
         web3.utils.toWei('1', 'ETHER')
       )
       .call()
  ]);

          // Calculate Kyber Eth Rates  //
  const kyber_eth_rates = {
    buy: parseFloat(1/(convertFromWei(results[0].expectedRate))),
    sell: parseFloat(convertFromWei(results[1].expectedRate))
    }

  kyber_eth_rates['spot'] = ((kyber_eth_rates.buy + kyber_eth_rates.sell)/2)
  //console.log(kyber_eth_rates.buy, kyber_eth_rates.sell, kyber_eth_rates.spot )


          // Calculate Kyber Coin Rates  //

  const kyber_coin_rates = {
    buy: parseFloat((kyber_eth_rates.spot)/(convertFromWei(results[2].expectedRate))),
    sell: parseFloat(convertFromWei(results[3].expectedRate) * kyber_eth_rates.spot)
    }
  kyber_coin_rates['spot'] = ((kyber_coin_rates.buy + kyber_coin_rates.sell)/2)

  tokens[name][1]['kyber'][0] = kyber_coin_rates.buy;
  tokens[name][1]['kyber'][1] = kyber_coin_rates.sell;
  tokens[name][1]['kyber'][2] = kyber_coin_rates.spot;

};



async function queryUniswap(name, contract){


    const routerContract = new web3.eth.Contract(abis.uni, addresses.uniswap.router)

    const eth_buy = await routerContract.methods.getAmountsOut(convertToWei(1), [addresses.tokens.dai, addresses.tokens.weth]).call()
    const eth_sell = await routerContract.methods.getAmountsOut(convertToWei(1), [addresses.tokens.weth, addresses.tokens.dai]).call()
    // use .01 to avoid miss-calculation with low liquidity coins
    const coin_buy = await routerContract.methods.getAmountsOut(convertToWei(.01), [addresses.tokens.weth, contract[0]]).call()
    const coin_sell = await routerContract.methods.getAmountsOut(convertToWei(1), [contract[0], addresses.tokens.weth]).call()


    console.log(convertFromWei(eth_sell[1]))
    const uni_eth_rates = {
      buy: parseFloat(1/(convertFromWei(eth_buy[1]))),
      sell: parseFloat(convertFromWei(eth_sell[1]))
      }

    uni_eth_rates['spot'] = ((uni_eth_rates.buy + uni_eth_rates.sell)/2)
    console.log(`Eth Buy ${uni_eth_rates.buy} Eth Sell: ${uni_eth_rates.sell} Eth Spot ${uni_eth_rates.spot}`)

    const coin_rates = {
      buy: parseFloat((.01*uni_eth_rates.spot)/(convertFromWei(coin_buy[1]))),
      sell: parseFloat(convertFromWei(coin_sell[1]) * uni_eth_rates.spot)
      }
    coin_rates['spot'] = ((coin_rates.buy + coin_rates.sell)/2)

    tokens[name][1]['uni'][0] = coin_rates.buy;
    tokens[name][1]['uni'][1] = coin_rates.sell;
    tokens[name][1]['uni'][2] = coin_rates.spot;
    console.log(tokens[name])



};

async function getSpotPrice() {
  for (let k in tokens) {
    queryKyber(k, tokens[k])
    queryUniswap(k, tokens[k])
  }
}

getSpotPrice()
