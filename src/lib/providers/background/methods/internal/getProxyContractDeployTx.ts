import { ContractFactory, ethers, Wallet } from 'ethers';
import { Wallet__factory } from '../../../../../typechain';
import { BackgroundOnMessageCallback } from '../../../../message-bridge/bridge';
import { getCurrentNetwork } from '../../../../requests/toRpcNode';
import { storageGet, StorageNamespaces } from '../../../../storage';
import { EthereumRequest } from '../../../types';
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { AccountInfo, StorageKeys } from '../types';

export const getProxyContractDeployTx: BackgroundOnMessageCallback<TransactionRequest, EthereumRequest> = async () => {
  const selectedAccount = await storageGet<AccountInfo>(StorageKeys.SELECTED_ACCOUNT, StorageNamespaces.USER_WALLETS);

  const privateKey = Wallet.createRandom(); // TODO - we need to get Private Key either through Seed Phrase + Mnemonic, or else

  const currNetwork = await getCurrentNetwork();

  const signer = new ethers.Wallet(privateKey ?? '', currNetwork.rpcProvider);

  // TODO: use wallet factory instead
  const factory = new ContractFactory(
    Wallet__factory.abi,
    Wallet__factory.bytecode,
    signer
  ) as Wallet__factory;

  const deployTx = factory.getDeployTransaction(signer.address);
  return deployTx;
};
