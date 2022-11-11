import * as ethers from 'ethers';
import { getCustomError } from '../../../../errors';
import { BackgroundOnMessageCallback, sendMessageFromBackgroundToBackground } from '../../../../message-bridge/bridge';
import { RuntimePostMessagePayload, RuntimePostMessagePayloadType } from '../../../../message-bridge/types';
import { EthereumRequest } from '../../../types';
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { getCurrentNetwork } from '../../../../requests/toRpcNode';
import { storageGet, StorageNamespaces, storageSet } from '../../../../storage';
import { AccountInfo, DeployedContractResult, Errors, StorageKeys } from '../types';

export const deployProxyContract: BackgroundOnMessageCallback<DeployedContractResult, EthereumRequest<TransactionRequest>> = async (req, domain) => {
  const tx = tryGetTx(req);

  const selectedAccount = await storageGet<AccountInfo>(StorageKeys.SELECTED_ACCOUNT, StorageNamespaces.USER_WALLETS);
  const accounts = await storageGet<AccountInfo[]>(StorageKeys.ACCOUNTS, StorageNamespaces.USER_WALLETS);

  const { rpcProvider } = await getCurrentNetwork();

  const nonce = tx.nonce ?? await rpcProvider.getTransactionCount(selectedAccount.masterAccount);

  const anticipatedAddress = ethers.ethers.utils.getContractAddress({from: selectedAccount.masterAccount, nonce });

  const txHash = await sendMessageFromBackgroundToBackground<string>({
    method: 'eth_sendTransaction',
    params: [tx]
  } as EthereumRequest<TransactionRequest>,
    RuntimePostMessagePayloadType.EXTERNAL, domain)

  const result = {
    address: anticipatedAddress, // TODO wait for success of TX
    txHash
  } as DeployedContractResult;

  selectedAccount.smartAccount = result.address;

  accounts.forEach(account => {
    if (account.masterAccount === selectedAccount.masterAccount) {
      account.smartAccount = result.address;
  }}); // TODO refactor

  await storageSet(StorageKeys.SELECTED_ACCOUNT, selectedAccount, StorageNamespaces.USER_WALLETS);
  await storageSet(StorageKeys.ACCOUNTS, accounts, StorageNamespaces.USER_WALLETS);

  return result;
};

function tryGetTx(req: RuntimePostMessagePayload<EthereumRequest<ethers.ethers.providers.TransactionRequest>>) {
  const tx = req.msg?.params?.[0];
  
  if (!tx)
    throw getCustomError(Errors.PAYLOAD)

  return tx;
}