import { getCustomError } from "../../../../errors";
import { BackgroundOnMessageCallback } from "../../../../message-bridge/bridge";
import { RuntimePostMessagePayload } from "../../../../message-bridge/types";
import { storageGet, StorageNamespaces, storageSet } from "../../../../storage";
import { getDeriveAccount } from "../../../../utils/accounts";
import { EthereumRequest } from "../../../types";
import { AccountInfo, Errors, InitializeWalletPayload, StorageKeys } from "../types";

export const initializeWallet: BackgroundOnMessageCallback<string, EthereumRequest<InitializeWalletPayload>> = async (request) => {
    const payload = await tryGetPayload(request);
    const account = getDeriveAccount(payload.mnemonic, 0);
    const accountInfo = { masterAccount: account.address } as AccountInfo;

    await storageSet(StorageKeys.MNEMONIC, payload.mnemonic, StorageNamespaces.USER_WALLETS);
    await storageSet(StorageKeys.ACCOUNTS, accountInfo, StorageNamespaces.USER_WALLETS);
    await storageSet(StorageKeys.SELECTED_ACCOUNT, accountInfo, StorageNamespaces.USER_WALLETS);

    return account.address;
}

async function tryGetPayload(request: RuntimePostMessagePayload<EthereumRequest<InitializeWalletPayload>>) {
    const payload = request?.msg?.params?.[0];

    if (!payload)
        throw getCustomError(Errors.PAYLOAD);

    if (await storageGet(StorageKeys.MNEMONIC, StorageNamespaces.USER_WALLETS))
        throw getCustomError(Errors.ALREADY_EXECUTED);
        
    return payload;
}