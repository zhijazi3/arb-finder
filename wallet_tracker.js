
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')

const HDWalletProvider = require('@truffle/hdwallet-provider')
const moment = require('moment-timezone')
const numeral = require('numeral')
const _ = require('lodash')
const axios = require('axios')
/*

// SERVER CONFIG
const PORT = process.env.PORT || 5000
const app = express();
const server = http.createServer(app).listen(PORT, () => console.log(`Listening on ${ PORT }`))

// WEB3 CONFIG
const web3 = new Web3(process.env.UNI_RPC_URL)
const dai_address = '0x6b175474e89094c44da98b954eedeac495271d0f'

// Web3 WSS
const web_socket = new Web3(process.env.UNI_RPC_WSS)

// Accounts to monitor
const shark = "0x0045666D334C90C63b9a9F124609dbbC9cfAe383"
const shark_address = shark.toLowerCase()
*/

const Web3 = require('web3');

class TransactionChecker {
    web3;
    web3ws;
    account;
    subscription;

    constructor(account) {
        this.web3ws = new Web3(process.env.UNI_RPC_WSS);
        this.web3 = new Web3(process.env.UNI_RPC_URL);
        //this.account = account.toLowerCase();
    }

    subscribe(topic) {
        this.subscription = this.web3ws.eth.subscribe(topic, (err, res) => {
            if (err) console.error(err);
        });
    }

    watchTransactions() {
        console.log('Watching all pending transactions...');
        this.subscription.on('data', (txHash) => {
            setTimeout(async () => {
                try {
                    let tx = await this.web3.eth.getTransaction(txHash);
                    if (tx != null) {
                      if ( array.includes(tx.from.toLowerCase()) ) {
                      //  if (this.account == tx.from.toLowerCase()) {
                            playSound1()
                            console.log({address: tx.from, value: this.web3.utils.fromWei(tx.value, 'ether'), timestamp: new Date()});
                        }
                        if ( array.includes(tx.to.toLowerCase()) ) {
                        //  if (this.account == tx.from.toLowerCase()) {
                              playSound1()
                              console.log({address: tx.from, value: this.web3.utils.fromWei(tx.value, 'ether'), timestamp: new Date()});
                          }

                    }
                } catch (err) {
                    console.error(err);
                }
            }, 1000)
        });
    }
}

function playSound1() {
  const player = require('play-sound')();
  player.play('./media/ahaa.m4a', (err) => {
    if (err) console.log(`could not play sound: ${err}`);
  })
}

const array = [
// Addresses to track
];

let txChecker = new TransactionChecker(array);
txChecker.subscribe('pendingTransactions');
txChecker.watchTransactions();
