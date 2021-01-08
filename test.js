const kyber_utils = require('./kyber_utils.js');
const uni_utils = require('./uni_utils.js');



(async () => {
  kyber_utils.getKyberTokens(function(kyber_list) {
    uni_utils.getUniTokens(kyber_list.kyber)
  });
})();
/*
utils.getKyberTokens().then(function(tokens){
console.log(tokens)
})
*/
