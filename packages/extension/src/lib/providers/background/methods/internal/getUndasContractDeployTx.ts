import { ContractFactory, ethers } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { TestGameContract__factory } from '../../../../../Popup/testContractFactory/TestGameContract__factory';
import { Wallet__factory } from '../../../../../Popup/testContractFactory/Wallet__factory';
import { getCustomError } from '../../../../errors';
import { BackgroundOnMessageCallback } from '../../../../message-bridge/bridge';
import { getCurrentNetwork } from '../../../../requests/toRpcNode';
import Storage, { StorageNamespaces } from '../../../../storage';
import { getBaseUrl } from '../../../../utils/url';
import { EthereumRequest } from '../../../types';
import { UserAccountDTO } from './initializeWallet';
import { TransactionRequest } from '@ethersproject/abstract-provider'

export const getUndasContractDeployTx: BackgroundOnMessageCallback<TransactionRequest, EthereumRequest> = async () => {

  const storageWallets = new Storage(StorageNamespaces.USER_WALLETS);

  // TODO: move selected account retrieving to helpers
  const selectedAccount = await storageWallets.get<UserAccountDTO>(
    'selectedAccount'
  );

  const privateKey = selectedAccount?.privateKey;

  const currNetwork = await getCurrentNetwork();

  const signer = new ethers.Wallet(privateKey ?? '', currNetwork.rpcProvider);

  // TODO: use wallet factory instead
  const factory = new ContractFactory(
    TestGameContract__factory.abi,
    TestGameContract__factory.bytecode,
    signer
  ) as TestGameContract__factory;

  const deployTx = factory.getDeployTransaction(signer.address);
  return deployTx;
};
