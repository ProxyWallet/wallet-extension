import { getCustomError } from "../../../../errors";
import { BackgroundOnMessageCallback } from "../../../../message-bridge/bridge";
import { RuntimePostMessagePayload } from "../../../../message-bridge/types";
import { storageGet, StorageNamespaces, storageSet } from "../../../../storage";
import { EthereumRequest } from "../../../types";
import { changeAddressForAllTabs } from "../../helpers"
import { AccountInfo, Errors, StorageKeys, SwitchAccountsRequestPayload } from "../types";

export const switchAccount: BackgroundOnMessageCallback<string, EthereumRequest<SwitchAccountsRequestPayload>> = async (
    payload, _
) => {
    const switchAccountAddress = tryGetAccountToSwitch(payload);

    const accounts = await storageGet<AccountInfo[]>(StorageKeys.ACCOUNTS, StorageNamespaces.USER_WALLETS);
    const switchAccount = accounts.find(a => a.masterAccount === switchAccountAddress)!;

    await storageSet<AccountInfo>(StorageKeys.SELECTED_ACCOUNT, switchAccount, StorageNamespaces.USER_WALLETS);
    await changeAddressForAllTabs(switchAccount.masterAccount);

    return switchAccount.masterAccount;
}

function tryGetAccountToSwitch(payload:RuntimePostMessagePayload<EthereumRequest<SwitchAccountsRequestPayload>>) {
    let address = payload?.msg?.params?.[0]?.address;
    if (!address)
        throw getCustomError(Errors.PAYLOAD);

    return address;
}