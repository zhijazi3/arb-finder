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
const dai_address = '0x6b175474e89094c44da98b954eedeac495271d0f'


// Uniswap Exchange Template: https://etherscan.io/address/0x09cabec1ead1c0ba254b09efb3ee13841712be14#code
UNISWAP_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const UNISWAP_ROUTER_ABI = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]


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

  const routerContract = new web3.eth.Contract(UNISWAP_ROUTER_ABI, UNISWAP_ROUTER_ADDRESS)

  const eth_data = await routerContract.methods.getAmountsOut(inputAmount, [tokenSwapAddress, dai_address]).call()
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
//  "EPAN":  ["0x72630B1e3B42874bf335020Ba0249e3E9e47Bafc", 1],
  "NSURE": ["0x20945ca1df56d237fd40036d47e866c7dccd2114", 1],
//  "UNDB":  ["0xd03B6ae96CaE26b743A6207DceE7Cbe60a425c70", 1],
  //"BUIDL": ["0x7b123f53421b1bf8533339bfbdc7c98aa94163db", 1],
  "PRQ":   ["0x362bc847a3a9637d3af6624eec853618a43ed7d2", 1],
//  "POND":  ["0x57B946008913B82E4dF85f501cbAeD910e58D26C", 1],
  "MAHA":  ["0xb4d930279552397bba2ee473229f89ec245bc365", 1],
  "3XT":   ["0x96Cf107E446A6e528FfD045F4eb6dFf3CDB6A666", 1],
  "XOR":   ["0x40FD72257597aA14C7231A7B1aaa29Fce868F677", 1],
  "DARK":  ["0x3108ccfd96816f9e663baa0e8c5951d229e8c6da", 1],
  "PTF":   [ "0xc57d533c50bc22247d49a368880fb49a1caa39f7", 1],
//  "DHT":  ["0xca1207647ff814039530d7d35df0e1dd2e91fa84", 1],
  "SPI":  ["0x9b02dd390a603add5c07f9fd9175b7dabe8d63b7", 1],
  "DIP":  ["0xc719d010b63e5bbf2c0551872cd5316ed26acd83", 1],
  //"PIS": ["0x834ce7ad163ab3be0c5fd4e0a81e67ac8f51e00c", 1],
//  "POOP": ["0x83e6f1e41cdd28eaceb20cb649155049fac3d5aa", 1],
  "MPC": ["0x2186ecb39f1b765ba7d78f1c43c2e9d7fc0c1eca", 1],
  "UNDX": ["0x95b3497bbcccc46a8f45f5cf54b0878b39f8d96c", 1],
  "CHI" : ['0x0000000000004946c0e9f43f4dee607b0ef1fa1c', 1],
  "API3" : ['0x0b38210ea11411557c13457d4da7dc6ea731b88a', 1],
  "UBT": ['0x8400d94a5cb0fa0d041a3788e395285d61c9ee5e', 1]
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
