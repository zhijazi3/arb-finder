
import { legos } from "@studydefi/money-legos";

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
