import { Adapter } from 'src/adapter';
import { Portfolio } from 'src/protocol.portfolio';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ZapWithdrawParams } from 'src/adapter.type';
import * as api from '@protocolink/api';
import { expect } from 'chai';
import hre from 'hardhat';
import { mainnetTokens } from '@protocolink/test-helpers';

describe('Transaction: Zap Withdraw', function () {
  const chainId = 1;
  let portfolio: Portfolio;
  let user: SignerWithAddress;
  let adapter: Adapter;

  before(async function () {
    adapter = new Adapter(chainId, hre.ethers.provider);
    user = await hre.ethers.getImpersonatedSigner('0x06e4Cb4f3ba9A2916B6384aCbdeAa74dAAF91550');
  });

  context('Test ZapWithdraw', function () {
    const testCases: ZapWithdrawParams[] = [
      {
        srcToken: mainnetTokens.WBTC,
        srcAmount: '0.0001',
        destToken: mainnetTokens.USDC,
      },
    ];
    const protocolId = 'aavev3';

    const aEthWBTC = {
      chainId: 1,
      address: '0x5Ee5bf7ae06D1Be5997A1A72006FE6C607eC6DE8',
      decimals: 8,
      symbol: 'aEthWBTC',
      name: 'Aave Ethereum WBTC',
    };

    for (const [i, params] of testCases.entries()) {
      it(`case ${i + 1}`, async function () {
        const zapWithdrawInfo = await adapter.getZapWithdrawQuotationAndLogics(
          protocolId,
          params,
          user.address,
          portfolio
        );

        const routerData: api.RouterData = {
          chainId,
          account: user.address,
          logics: zapWithdrawInfo.logics,
        };

        const estimateResult = await api.estimateRouterData(routerData, 'approve');

        expect(estimateResult).to.include.all.keys('funds', 'balances', 'approvals');
        expect(estimateResult.funds).to.have.lengthOf(1);
        expect(estimateResult.funds.get(aEthWBTC).amount).to.be.eq('0.0001');
        expect(estimateResult.balances).to.have.lengthOf(1);
        expect(estimateResult.balances.get(mainnetTokens.USDC).amount).to.be.eq(zapWithdrawInfo.fields.destAmount);
        expect(estimateResult.approvals).to.have.lengthOf(2);

        for (const approval of estimateResult.approvals) {
          await expect(user.sendTransaction(approval)).to.not.be.reverted;
        }

        const transactionRequest = await api.buildRouterTransactionRequest(routerData);

        expect(transactionRequest).to.include.all.keys('to', 'data', 'value');

        const tx = await user.sendTransaction(transactionRequest);
        expect(tx).to.not.be.reverted;
      });
    }
  });
});
