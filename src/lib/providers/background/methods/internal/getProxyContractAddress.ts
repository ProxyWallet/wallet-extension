import { storageGet, StorageNamespaces } from '../../../../storage';
import { AccountInfo, StorageKeys } from '../types';

export const getProxyContractAddress = 
  () => storageGet<AccountInfo>(StorageNamespaces.USER_WALLETS, StorageKeys.SELECTED_ACCOUNT)
          .then(i => i.smartAccount);