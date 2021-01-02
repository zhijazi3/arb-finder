
//import { legos } from "@studydefi/money-legos";
const balancer = require("@studydefi/money-legos/balancer");
const Web3 = require('web3');
// access ABIs and addresses
balancerAddress = balancer.ExchangeProxy.address;
balancerAbi = balancer.ExchangeProxy.abi;

balancerFactAddress = balancer.PoolFactory.address;
balancerFactoryAbi = balancer.PoolFactory.abi;

// WEB3 CONFIG
const web3 = new Web3(process.env.UNI_RPC_URL)

// import addresses
const { mainnet: addresses } = require('./addresses');

// create pool
const factory = new web3.eth.Contract(
  balancerFactoryAbi,
  balancerFactAddress
);
//console.log(factory)
const pool = factory.newBPool;

//console.log(pool);

balancerPoolAbi = balancer.BPool.abi;

const poolRouter = new web3.eth.Contract(
  balancerPoolAbi,
  '0x05F661A1BD2dA5E59C8e06b92ACdCdE2706110E5'
);
console.log(poolRouter.methods.calcSpotPrice(123123, 123123, 123123 ,123123, 123123))
//const price = poolRouter.methods.getSpotPrice.call(address(addresses.tokens.ptf), address(addresses.tokens.weth) );
//console.log(price)
//console.log(price);
//console.log(poolRouter.methods.getSwapFee())
//const price = poolRouter.methods.calcSpotPrice(address addresses.tokens.ptf, address addresses.tokens.weth);
//console.log(price);
//console.log(Object.getOwnPropertyNames(poolRouter.methods));
//console.log(Object.getOwnPropertyNames(poolRouter.methods).filter(function (p) {
//    return typeof poolRouter[p] === 'function';
//}));
//console.log(poolRouter.MAX_FEE)
//const price = poolRouter.getSpotPrice(addresses.tokens.ptf, addresses.tokens.weth);
//const price1 = poolRouter.calcSpotPrice(address addresses.tokens.ptf, address addresses.tokens.weth);
//console.log(poolRouter);
//console.log(balancerPoolAbi);
//console.log(balancerAddress);
//console.log(poolRouter.MAX_FEE)




const router = new web3.eth.Contract(
  balancerAbi,
  balancerAddress
);

addresses.tokens.ptf
addresses.tokens.weth
/*
const swap = [
  ETH_MUSD_50_50_POOL_ADDRESS,
  tokenInParam,
  tokenOutParam,
  maxPrice,
];

const minTotalAmountOut = 1;
function getBalOutput() {
(async  () => {
  const outputAmount = await router.batchSwapExactIn(
    swaps,
    addresses.tokens.weth, // token in
    addresses.tokens.ptf, // token out
    web3.utils.toWei('1', 'ETHER'),
    minTotalAmountOut,

)});
};

const amountOut = getBalOutput()
console.log(amountOut)


/*
 test("Swap ETH -> mUSD", async () => {
  // given
  const beforeWei = await mUSD.balanceOf(wallet.address);
  const before = parseFloat(fromWei(beforeWei));
  expect(before).toEqual(0);

  // when
  const tokenInParam = parseEther("10");
  const tokenOutParam = 0;
  const maxPrice = MAX_UINT256;
  const swap = [
    ETH_MUSD_50_50_POOL_ADDRESS,
    tokenInParam,
    tokenOutParam,
    maxPrice,
  ];
  const swaps: any = [swap];

  const tokenOut = mUSD.address;
  const minTotalAmountOut = 1;
  await exchangeProxy.batchEthInSwapExactIn(
    swaps,
    tokenOut,
    minTotalAmountOut,
    {
      gasLimit: 500000,
      value: tokenInParam,
    },
  );

  // then
  const afterWei = await mUSD.balanceOf(wallet.address);
  const after = parseFloat(fromWei(afterWei));
  expect(after).toBeGreaterThan(0);
});
*/
