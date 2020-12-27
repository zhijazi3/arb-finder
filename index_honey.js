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
const PORT = process.env.PORT || 3000
const app = express();
const server = http.createServer(app).listen(PORT, () => console.log(`Listening on ${ PORT }`))

// WEB3 CONFIG
const web3 = new Web3(process.env.HONEY_RPC_URL)

// import kyber and uni abos stored in abis folder
const abis = require('./abis');

// import addresses
const { mainnet: addresses } = require('./addresses');


HONEYSWAP_ROUTER_ADDRESS = addresses.honeyswap.router;



const https = require('https')
function getEthPrice() {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
    https
      .get("https://openapi.bitmart.com/v2/ticker?symbol=ETH_USDT", resp => {
        let data = "";
        resp.on("data", chunk => {
          data += chunk;
        });
        resp.on("end", () => {
          let eth_usd = JSON.parse(data).current_price;
          resolve(eth_usd)

        });
      })
      .on("error", err => {
        reject("Error: " + err.message);
      });
    }, 3000)
  })
}



var count = 1

async function checkUniswapToKyber(args) {
  const { tokenSymbol, tokenAddress, tokenSwapSymbol, tokenSwapAddress, inputAmount, prevPrice} = args

  const routerContract = new web3.eth.Contract(abis.honey, HONEYSWAP_ROUTER_ADDRESS)
  const uniswapResult = await routerContract.methods.getAmountsOut(inputAmount, [tokenAddress, tokenSwapAddress]).call()

  const uniswapRate = web3.utils.fromWei(uniswapResult[1], 'Ether')
  const ethAmount = Math.round(inputAmount * uniswapRate).toString()
  //console.log(ethAmount)


  //console.log(web3.utils.fromWei(ethAmount, 'Ether'))
  const current = web3.utils.fromWei(ethAmount, 'Ether')






  if(count > 1) {
    diff_actual = current - prevPrice
    //console.log(tokenSymbol, token_usd)
    diff_abs = Math.abs(current - prevPrice)
    //console.log(current)
    //console.log(prevPrice)

    var change = (diff_abs / prevPrice).toString()



    if(change > .03) {
      if(diff_actual > 0) {
        console.log('HIGHER', change, tokenSymbol, '=>', current)
      } else {
        console.log('LOWER', change, tokenSymbol, '=>', current )
      }

      const player = require('play-sound')();
      player.play('./media/ahaa.m4a', (err) => {
        if (err) console.log(`could not play sound: ${err}`);
      })
    }  else {
      console.log(tokenSymbol, current, change)
    }
  }

  count++;


  return current
}







let priceMonitor
let monitoringPrice = false
let prev_honey = 1
let prev_link = 1
let prev_stake = 1
let prev_ubt = 1
let prev_lyxe = 1
let prev_layer = 1
let prev_akro = 1
let prev_xor = 1
let prev_undb = 1
async function monitorPrice() {
  if(monitoringPrice) {
    return
  }

  console.log("Checking prices...")
  //monitoringPrice = true

  try {






      prev_stake = await checkUniswapToKyber({
            tokenSymbol: 'STAKE',
            tokenAddress: '0xb7D311E2Eb55F2f68a9440da38e7989210b9A05e',
            tokenSwapSymbol: 'WXDAI',
            tokenSwapAddress: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
            inputAmount: web3.utils.toWei('1', 'ETHER'), // 1 Dai
            prevPrice: prev_stake,
          })
          /*
      prev_ubt = await checkUniswapToKyber({
            tokenSymbol: 'UBT',
            tokenAddress: '0xd3b93fF74E43Ba9568e5019b38AdDB804feF719B',
            tokenSwapSymbol: 'WXDAI',
            tokenSwapAddress: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
            inputAmount: web3.utils.toWei('1', 'ETHER'), // 1 Dai
            prevPrice: prev_ubt,
          })
*/
      prev_link = await checkUniswapToKyber({
            tokenSymbol: 'LINK',
            tokenAddress: '0xE2e73A1c69ecF83F464EFCE6A5be353a37cA09b2',
            tokenSwapSymbol: 'WXDAI',
            tokenSwapAddress: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
            inputAmount: web3.utils.toWei('1', 'ETHER'), // 1 Dai
            prevPrice: prev_link,
          })
          /*
      prev_honey = await checkUniswapToKyber({
            tokenSymbol: 'HONEY',
            tokenAddress: '0x71850b7E9Ee3f13Ab46d67167341E4bDc905Eef9',
            tokenSwapSymbol: 'WXDAI',
            tokenSwapAddress: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
            inputAmount: web3.utils.toWei('1', 'ETHER'), // 1 Dai
            prevPrice: prev_honey,
          })
*/

//    prev = ret




  } catch (error) {
    console.error(error)
    monitoringPrice = false
    clearInterval(priceMonitor)
    return
  }

  monitoringPrice = false
}

// Check markets every n seconds
const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 2000 // 3 Seconds
//priceMonitor = setInterval(async () => { await main() }, POLLING_INTERVAL)
priceMonitor = setInterval(async () => { await monitorPrice() }, POLLING_INTERVAL)
