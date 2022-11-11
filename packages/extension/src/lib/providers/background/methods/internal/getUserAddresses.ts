import { BackgroundOnMessageCallback } from "../../../../message-bridge/bridge";
import { storageGet, StorageNamespaces } from "../../../../storage";
import { EthereumRequest } from "../../../types";
import { AccountInfo, StorageKeys } from "../types";
import { } from "./initializeWallet";

export const getUserAddresses: BackgroundOnMessageCallback<AccountInfo[], EthereumRequest<string>> = 
    () => storageGet<AccountInfo[]>(StorageKeys.ACCOUNTS, StorageNamespaces.USER_WALLETS);