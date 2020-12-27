require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider')
const moment = require('moment-timezone')
const numeral = require('numeral')
const _ = require('lodash')
const axios = require('axios')

// SERVER CONFIG
const PORT = process.env.PORT || 5000
const app = express();
const server = http.createServer(app).listen(PORT, () => console.log(`Listening on ${ PORT }`))

// WEB3 CONFIG
const web3 = new Web3(process.env.UNI_RPC_URL)

// import kyber and uni abos stored in abis folder
const abis = require('./abis');

// import addresses
const { mainnet: addresses } = require('./addresses');


UNISWAP_ROUTER_ADDRESS = addresses.uniswap.router

function playSound1() {
  const player = require('play-sound')();
  player.play('./media/ahaa.m4a', (err) => {
    if (err) console.log(`could not play sound: ${err}`);
  })
}
function playSound2() {
  const player = require('play-sound')();
  player.play('./media/bebwaj.m4a', (err) => {
    if (err) console.log(`could not play sound: ${err}`);
  })
}


async function checkUniPrices(args) {
  const { tokenSymbol, tokenAddress, tokenSwapSymbol, tokenSwapAddress, inputAmount, prevPrice} = args

  const routerContract = new web3.eth.Contract(abis.uni, UNISWAP_ROUTER_ADDRESS)

  const eth_data = await routerContract.methods.getAmountsOut(inputAmount, [tokenSwapAddress, addresses.tokens.dai]).call()
  const token_data = await routerContract.methods.getAmountsOut(inputAmount, [tokenAddress, tokenSwapAddress]).call()

  const ethPrice = parseFloat(web3.utils.fromWei(eth_data[1], 'Ether'))
  const coinPrice = parseFloat(web3.utils.fromWei(token_data[1], 'Ether'))
  let curPrice = parseFloat(coinPrice * ethPrice)


  if(count > 1) {
    diff = curPrice - prevPrice
    diff_abs = Math.abs(curPrice - prevPrice)
    var change = (diff_abs / prevPrice).toFixed(8)

    if(change > .035) {

      if(diff > 0) {
        console.log('HIGHER', change, tokenSymbol, '=>', curPrice)
      } else {
        console.log('LOWER', change, tokenSymbol, '=>', curPrice )
      }

      if(change > 0.1) {
        playSound1()
        setTimeout(playSound1, 4000)
      } else {
        x=1
        playSound2()
      }

    }  else {
      console.log(tokenSymbol,  parseFloat(curPrice),  ' -> ',change)
    }
  }
  return curPrice
}

const tokensA={
  "ZEFU":  ['0xb1e9157c2fdcc5a856c8da8b2d89b6c32b3c1229', 1],
  "STAKE": ["0x0Ae055097C6d159879521C384F1D2123D1f195e6", 1],
  "EWTB":  ["0x178c820f862b14f316509ec36b13123da19a6054", 1],
  "IDLE":  ["0x875773784af8135ea0ef43b5a374aad105c5d39e", 1],
  //"WOZX":  ["0x34950ff2b487d9e5282c5ab342d08a2f712eb79f", 1],
  //"UNN":   ["0x226f7b842E0F0120b7E194D05432b3fd14773a9D", 1],
  //"SMART": ["0x72e9d9038ce484ee986fea183f8d8df93f9ada13", 1],
  "LYXE":  ["0xA8b919680258d369114910511cc87595aec0be6D", 1],
  "EPAN":  ["0x72630B1e3B42874bf335020Ba0249e3E9e47Bafc", 1],
  "NSURE": ["0x20945ca1df56d237fd40036d47e866c7dccd2114", 1],
  "UNDB":  ["0xd03B6ae96CaE26b743A6207DceE7Cbe60a425c70", 1],
  //"BUIDL": ["0x7b123f53421b1bf8533339bfbdc7c98aa94163db", 1],
  "PRQ":   ["0x362bc847a3a9637d3af6624eec853618a43ed7d2", 1],
//  "POND":  ["0x57B946008913B82E4dF85f501cbAeD910e58D26C", 1],
  "MAHA":  ["0xb4d930279552397bba2ee473229f89ec245bc365", 1],
  "3XT":   ["0x96Cf107E446A6e528FfD045F4eb6dFf3CDB6A666", 1],
  "XOR":   ["0x40FD72257597aA14C7231A7B1aaa29Fce868F677", 1],
  "DARK":  ["0x3108ccfd96816f9e663baa0e8c5951d229e8c6da", 1]
};

const tokensB={
  "ZEFU":  ['0xb1e9157c2fdcc5a856c8da8b2d89b6c32b3c1229', 1],
};


// set toekens to desired token list
const tokens = tokensA

let count = 0;
async function feedSet(name, address, prev_price) {

  tokens[name][1] = await checkUniPrices({
    tokenSymbol: name,
    tokenAddress: address,
    tokenSwapSymbol: 'WETH',
    tokenSwapAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    inputAmount: web3.utils.toWei('1', 'ETHER'), // 1 Dai
    prevPrice: prev_price,
    })

};

let monitoringPrice = false

async function monitorPrice() {
  count ++
  if(monitoringPrice) {
    return
  }
  console.log("Checking prices...")
  try {

for (let k in tokens) {
  feedSet(k, tokens[k][0], tokens[k][1])
  }

  } catch (error) {
    console.error(error)
//    monitoringPrice = false
//    clearInterval(priceMonitor)
    return
  }

  monitoringPrice = false
}

// Check markets every n seconds
const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 6000 // 3 Seconds
//priceMonitor = setInterval(async () => { await main() }, POLLING_INTERVAL)
priceMonitor = setInterval(async () => { await monitorPrice() }, POLLING_INTERVAL)
