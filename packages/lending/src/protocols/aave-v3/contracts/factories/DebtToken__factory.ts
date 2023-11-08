/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from 'ethers';
import type { Provider } from '@ethersproject/providers';
import type { DebtToken, DebtTokenInterface } from '../DebtToken';

const _abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegatee',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approveDelegation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'fromUser',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'toUser',
        type: 'address',
      },
    ],
    name: 'borrowAllowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export class DebtToken__factory {
  static readonly abi = _abi;
  static createInterface(): DebtTokenInterface {
    return new utils.Interface(_abi) as DebtTokenInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): DebtToken {
    return new Contract(address, _abi, signerOrProvider) as DebtToken;
  }
}
