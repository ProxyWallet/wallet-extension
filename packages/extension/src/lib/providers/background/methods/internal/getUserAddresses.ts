import { getCustomError } from "../../../../errors";
import { BackgroundOnMessageCallback } from "../../../../message-bridge/bridge";
import Storage, { StorageNamespaces } from "../../../../storage";
import { EthereumRequest } from "../../../types";
import { UserAccountDTO } from "./initializeWallet";

export const getUserAddresses: BackgroundOnMessageCallback<string[], EthereumRequest> = async () => {
    const storageWallets = new Storage(StorageNamespaces.USER_WALLETS);

    const accounts = await storageWallets.get<UserAccountDTO[]>('accounts');
    console.log('accounts', accounts);

    if (!accounts || !accounts.length) {
        throw getCustomError('getUserAddresses: 0 accounts');
    }

    return accounts.map(acc => acc.address);
}