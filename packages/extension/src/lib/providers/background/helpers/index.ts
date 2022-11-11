import { getAddress } from "ethers/lib/utils"
import Browser from "webextension-polyfill"
import { getCustomError } from "../../../errors"
import { sendMessageToTab } from "../../../message-bridge/bridge"
import { PostMessageDestination } from "../../../message-bridge/types"
import { storageGetAllKeys, StorageNamespaces } from "../../../storage"
import { normalizeURL } from "../../../utils/url"
import { EthereumRequest, MessageMethod } from "../../types"

export const changeAddressForAllTabs = async (address:string) => {
    const domains = await storageGetAllKeys(StorageNamespaces.CONNECTED_DOMAINS);
    
    await Promise.all(domains.map(domain => sendAccountChangedToTab(domain, address)));
}

export const sendAccountChangedToTab = async (tabDomain: string, switchToAddress: string) => {
    const tabs = (await Browser.tabs.query({}) ?? []).filter(v=>normalizeURL(v.url ?? '') === tabDomain);

    tabs.forEach(tab => {
        if (!tab || !tab.id) return;

        sendMessageToTab<EthereumRequest<string | undefined>>(
            tab.id,
            PostMessageDestination.WINDOW,
            {
                method: MessageMethod.changeAddress,
                params: [switchToAddress] // TODO: investigate
            }
        )    
    });
    
}

export function getArrayWithoutElement(array: string[], elementToRemove: string) {
    const addressArrayIndex = array.indexOf(elementToRemove);

    if (addressArrayIndex === undefined || addressArrayIndex <= -1)
        throw getCustomError("Element is not in the array");

    return array.splice(addressArrayIndex, 1);
}