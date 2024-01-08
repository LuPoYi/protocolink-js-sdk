import { Portfolio } from './protocol.portfolio';
import * as apisdk from '@protocolink/api';
import * as common from '@protocolink/common';

export interface OperationInput {
  account: string;
  portfolio: Portfolio;
  srcToken: common.Token;
  srcAmount: string;
  destToken: common.Token;
  slippage?: number;
}

export class OperationError extends Error {
  name: string;
  code: string;

  constructor(name: string, code: string) {
    super(`${name}: ${code}`);
    this.name = name;
    this.code = code;
  }
}

export type OperationOutput = {
  destAmount: string;
  afterPortfolio: Portfolio;
  error?: OperationError;
  logics: apisdk.Logic[];
};
