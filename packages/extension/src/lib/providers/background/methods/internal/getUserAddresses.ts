import { getAddress } from "ethers/lib/utils";
import { getCustomError } from "../../../../errors";
import { BackgroundOnMessageCallback } from "../../../../message-bridge/bridge";
import Storage, { StorageNamespaces } from "../../../../storage";
import { getBaseUrl } from "../../../../utils/url";
import { EthereumRequest } from "../../../types";
import { UserAccount, UserSelectedAccount } from "./initializeWallet";

export type GetAccountsDTO = {
    address: string,
    isConnected: boolean,
    isImported: boolean,
    isActive: boolean,
    undasContract?: {
        address: string,
        isConnected: boolean
        isActive: boolean
    }
}

export const getUserAddresses: BackgroundOnMessageCallback<GetAccountsDTO[], EthereumRequest<string>> = async (
    payload, _
) => {
    if (!payload.msg || !payload.msg.params) {
        throw getCustomError('Invalid payload');
    }

    const [url] = payload.msg.params;

    const domain = getBaseUrl(url);

    const storageWallets = new Storage(StorageNamespaces.USER_WALLETS);
    const storageDomains = new Storage(StorageNamespaces.CONNECTED_DOMAINS);

    // TODO: move keys to enum
    const accounts = await storageWallets.get<UserAccount[]>('accounts');
    const selectedAccount = await storageWallets.get<UserSelectedAccount>('selectedAccount');
    const connectedAccounts = await storageDomains.get<string[]>(domain);

    console.log('domain', domain);
    console.log('accounts', accounts);
    console.log('selectedAccount', selectedAccount);
    console.log('connectedAccounts', connectedAccounts);

    if (!accounts || !accounts.length) {
        throw getCustomError('getUserAddresses: 0 accounts');
    }

    return accounts.map(acc => {
        const isSelected =
            selectedAccount ?
                getAddress(acc.address) === getAddress(selectedAccount.address) : false

        return {
            address: acc.address,
            isActive: isSelected,
            isImported: acc.isImported,
            isConnected: connectedAccounts ?
                connectedAccounts.map(getAddress).includes(getAddress(acc.address))
                : false,
            undasContract: acc.undasContract ? {
                address: acc.undasContract,
                isActive: isSelected ? selectedAccount?.isUndasContractSelected ?? false : false,
                isConnected: connectedAccounts ?
                    connectedAccounts.map(getAddress).includes(getAddress(acc.undasContract))
                    : false,
            } : undefined
        } as GetAccountsDTO
    });
}