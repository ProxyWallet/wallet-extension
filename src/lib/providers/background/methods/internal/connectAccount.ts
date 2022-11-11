import Browser from "webextension-polyfill";
import { getCustomError } from "../../../../errors";
import { BackgroundOnMessageCallback } from "../../../../message-bridge/bridge";
import { RuntimePostMessagePayload } from "../../../../message-bridge/types";
import { storageGet, StorageNamespaces, storageSet } from "../../../../storage";
import { normalizeURL } from "../../../../utils/url";
import { EthereumRequest } from "../../../types";
import { Errors } from "../types";

export const connectAccount: BackgroundOnMessageCallback<void, EthereumRequest<string>> = async (
    req
) => {
    const [domain, accountToConnect] = await tryGetDomainAndAccount(req);
    let connectedAddresses = await storageGet<string[]>(domain, StorageNamespaces.CONNECTED_DOMAINS)

    if (connectedAddresses.find(i => i === accountToConnect)) {
        throw getCustomError(Errors.ALREADY_EXECUTED);
    }
    else {
        connectedAddresses?.push(accountToConnect);
    }
    
    await storageSet(domain, connectedAddresses, StorageNamespaces.CONNECTED_DOMAINS);
}

async function tryGetDomainAndAccount(req:RuntimePostMessagePayload<EthereumRequest<string>>) {
    const domain = await Browser.tabs.query({active: true, currentWindow: true }).then(i => i?.[0]?.url)
    const accountToConnect = req?.msg?.params?.[0];

    if (!accountToConnect) {
        throw getCustomError('ethRequestAccounts: invalid data');
    }

    if (!domain) {
        throw getCustomError('Invalid sender origin')
    }

    return [normalizeURL(domain),accountToConnect];
}