import { BackgroundOnMessageCallback } from "../../../../message-bridge/bridge";
import { storageGet, StorageNamespaces } from "../../../../storage";
import { EthereumRequest } from "../../../types";
import { StorageKeys } from "../types";

export const isWalletInitialized: BackgroundOnMessageCallback<boolean, EthereumRequest> = 
    () => storageGet(StorageKeys.MNEMONIC, StorageNamespaces.USER_WALLETS);