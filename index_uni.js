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



// Uniswap Exchange Template: https://etherscan.io/address/0x09cabec1ead1c0ba254b09efb3ee13841712be14#code
UNISWAP_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const UNISWAP_ROUTER_ABI = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]




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
  const { tokenSymbol, tokenAddress, tokenSwapSymbol, tokenSwapAddress, inputAmount, prevPrice, ethPrice} = args

  const routerContract = new web3.eth.Contract(UNISWAP_ROUTER_ABI, UNISWAP_ROUTER_ADDRESS)
  const uniswapResult = await routerContract.methods.getAmountsOut(inputAmount, [tokenAddress, tokenSwapAddress]).call()

  const uniswapRate = web3.utils.fromWei(uniswapResult[1], 'Ether')
  //const uniswapRate = web3.utils.fromWei('1000000000000000000', 'Ether')
  //console.log(uniswapRate)
  const ethAmount = Math.round(inputAmount * uniswapRate).toString()


  //console.log(web3.utils.fromWei(ethAmount, 'Ether'))
  const current = web3.utils.fromWei(ethAmount, 'Ether')




  if(count > 1) {
    diff_actual = current - prevPrice
    token_usd = current * ethPrice
    //console.log(tokenSymbol, token_usd)
    diff_abs = Math.abs(current - prevPrice)
    //console.log(current)
    //console.log(prevPrice)
    var change = (diff_abs / prevPrice).toString()



    if(change > .028) {
      if(diff_actual > 0) {
        console.log('HIGHER', change, tokenSymbol, '=>', token_usd)
      } else {
        console.log('LOWER', change, tokenSymbol, '=>', token_usd )
      }

      const player = require('play-sound')();
      player.play('./media/bebwaj.m4a', (err) => {
        if (err) console.log(`could not play sound: ${err}`);
      })
    }  else {
      console.log(tokenSymbol, token_usd, change)
    }
  }

  count++;


  return current
}







let priceMonitor
let monitoringPrice = false
let prev_dft = 1
let prev_ewtb = 1
let prev_stake = 1
let prev_link = 1
let prev_lyxe = 1
let prev_easy = 1
let prev_akro = 1
let prev_xor = 1
let prev_undb = 1
let prev_rari = 1
let prev_axia = 1
async function monitorPrice() {
  if(monitoringPrice) {
    return
  }

  console.log("Checking prices...")
  //monitoringPrice = true

  try {

    // ADD YOUR CUSTOM TOKEN PAIRS HERE!!!
    let eth_price = await getEthPrice();


    prev_dft = await checkUniswapToKyber({
          tokenSymbol: 'DFT',
          tokenAddress: '0xB6eE603933E024d8d53dDE3faa0bf98fE2a3d6f1',
          tokenSwapSymbol: 'WETH',
          tokenSwapAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          inputAmount: web3.utils.toWei('1', 'ETHER'), // 1 Dai
          prevPrice: prev_dft,
          ethPrice: eth_price,
        })

      prev_stake = await checkUniswapToKyber({
            tokenSymbol: 'STAKE',
            tokenAddress: '0x0Ae055097C6d159879521C384F1D2123D1f195e6',
            tokenSwapSymbol: 'WETH',
            tokenSwapAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            inputAmount: web3.utils.toWei('1', 'ETHER'), // 1 Dai
            prevPrice: prev_stake,
            ethPrice: eth_price,
          })
      prev_ewtb = await checkUniswapToKyber({
            tokenSymbol: 'EWTB',
            tokenAddress: '0x178c820f862b14f316509ec36b13123da19a6054',
            tokenSwapSymbol: 'WETH',
            tokenSwapAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            inputAmount: web3.utils.toWei('1', 'ETHER'), // 1 Dai
            prevPrice: prev_ewtb,
            ethPrice: eth_price,
          })

      prev_link = await checkUniswapToKyber({
            tokenSymbol: 'link',
            tokenAddress: '0x514910771af9ca656af840dff83e8264ecf986ca',
            tokenSwapSymbol: 'WETH',
            tokenSwapAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            inputAmount: web3.utils.toWei('1', 'ETHER'), // 1 Dai
            prevPrice: prev_link,
            ethPrice: eth_price,
          })


      prev_lyxe = await checkUniswapToKyber({
            tokenSymbol: 'LYXe',
            tokenAddress: '0xA8b919680258d369114910511cc87595aec0be6D',
            tokenSwapSymbol: 'WETH',
            tokenSwapAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            inputAmount: web3.utils.toWei('1', 'ETHER'), // 1 Dai
            prevPrice: prev_lyxe,
            ethPrice: eth_price,
          })

      prev_easy = await checkUniswapToKyber({
            tokenSymbol: 'EASY',
            tokenAddress: '0x913D8ADf7CE6986a8CbFee5A54725D9Eea4F0729',
            tokenSwapSymbol: 'WETH',
            tokenSwapAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            inputAmount: web3.utils.toWei('1', 'ETHER'), // 1 Dai
            prevPrice: prev_easy,
            ethPrice: eth_price,
          })

      prev_akro = await checkUniswapToKyber({
            tokenSymbol: 'AKRO',
            tokenAddress: '0x8ab7404063ec4dbcfd4598215992dc3f8ec853d7',
            tokenSwapSymbol: 'WETH',
            tokenSwapAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            inputAmount: web3.utils.toWei('1', 'ETHER'), // 1 Dai
            prevPrice: prev_akro,
            ethPrice: eth_price,
          })
      prev_xor = await checkUniswapToKyber({
            tokenSymbol: 'XOR',
            tokenAddress: '0x40FD72257597aA14C7231A7B1aaa29Fce868F677',
            tokenSwapSymbol: 'WETH',
            tokenSwapAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            inputAmount: web3.utils.toWei('1', 'ETHER'), // 1 Dai
            prevPrice: prev_xor,
            ethPrice: eth_price,
          })

    prev_undb = await checkUniswapToKyber({
          tokenSymbol: 'UNDB',
          tokenAddress: '0xd03B6ae96CaE26b743A6207DceE7Cbe60a425c70',
          tokenSwapSymbol: 'WETH',
          tokenSwapAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          inputAmount: web3.utils.toWei('1', 'ETHER'), // 1 Dai
          prevPrice: prev_undb,
          ethPrice: eth_price,
        })

    prev_rari = await checkUniswapToKyber({
          tokenSymbol: 'RARI',
          tokenAddress: '0xfca59cd816ab1ead66534d82bc21e7515ce441cf',
          tokenSwapSymbol: 'WETH',
          tokenSwapAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          inputAmount: web3.utils.toWei('1', 'ETHER'), // 1 Dai
          prevPrice: prev_rari,
          ethPrice: eth_price,
        })

    prev_axia = await checkUniswapToKyber({
          tokenSymbol: 'AXIA',
          tokenAddress: '0x793786e2dd4Cc492ed366a94B88a3Ff9ba5E7546',
          tokenSwapSymbol: 'WETH',
          tokenSwapAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          inputAmount: web3.utils.toWei('1', 'ETHER'), // 1 Dai
          prevPrice: prev_axia,
          ethPrice: eth_price,
        })
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
const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 9000 // 3 Seconds
//priceMonitor = setInterval(async () => { await main() }, POLLING_INTERVAL)
priceMonitor = setInterval(async () => { await monitorPrice() }, POLLING_INTERVAL)
