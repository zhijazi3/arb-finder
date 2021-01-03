const request = require('request');

let url = "https://api.kyber.network/currencies";

let options = {json: true};

var tokens = {'kyber': {}};

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

async function  getKyberTokens() {
  console.log('herh')
  await request(url, options, (error, res, body) => {
      if (error) {
          return  console.log(error)
      };

      if (!error && res.statusCode == 200) {
        for (let index in body['data']) {
          addToken(body.data[index])

        }
       //return tokens
      // console.table(tokens.kyber)
       //const test = 'hello'
       return 'hehr'
      };

      //console.log(tokens.kyber)
    //  return tokens
  });
}

(async function(){
  let token_list = await getKyberTokens();
  console.table(token_list);
})();
//getKyberTokens()
// export helper methods
module.exports = {
  getKyberTokens
};
