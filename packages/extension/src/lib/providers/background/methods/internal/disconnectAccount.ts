import Browser from "webextension-polyfill";
import { getCustomError } from "../../../../errors";
import { BackgroundOnMessageCallback } from "../../../../message-bridge/bridge";
import { storageGet, StorageNamespaces, storageSet } from "../../../../storage";
import { normalizeURL } from "../../../../utils/url";
import { EthereumRequest } from "../../../types";
import { getArrayWithoutElement } from "../../helpers/index"

export const disconnectAccount: BackgroundOnMessageCallback<void, EthereumRequest<string>> = async (req) => {
    const [currentTabUrl] = await Browser.tabs.query({
        active: true,
        currentWindow: true,
    })

    const origin = currentTabUrl.url ?? '';

    const domain = normalizeURL(origin);

    if (!req.msg || !req.msg.params || !req.msg.params.length) {
        throw getCustomError('ethRequestAccounts: invalid data'); // TODO Errors
    }

    const [accountToDisconnect] = req.msg.params;
    if (!domain) {
        throw getCustomError('Invalid sender origin')
    }

    const oldConnectedAddresses = await storageGet<string[]>(domain, StorageNamespaces.CONNECTED_DOMAINS)
    const newConnectedAddresses = getArrayWithoutElement(oldConnectedAddresses, accountToDisconnect);

    await storageSet(domain, newConnectedAddresses, StorageNamespaces.CONNECTED_DOMAINS);
}