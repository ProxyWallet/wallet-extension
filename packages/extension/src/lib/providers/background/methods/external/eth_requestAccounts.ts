import { getCustomError } from "../../../../errors";
import WindowPromise, { sendRuntimeMessageToPopup } from "../../../../message-bridge/bridge";
import { RuntimeOnMessageResponse, RuntimePostMessagePayload, RuntimePostMessagePayloadType } from "../../../../message-bridge/types";
import { getPopupPath, UIRoutes } from "../../../../popup-routes";
import Storage, { StorageNamespaces } from "../../../../storage";
import { EthereumRequest } from "../../../types";

export const ethRequestAccounts = async (
    payload: EthereumRequest,
    sender: chrome.runtime.MessageSender,
    type: RuntimePostMessagePayloadType
): Promise<RuntimeOnMessageResponse<string[]>> => {
    console.log('ethRequestAccounts');
    const window = new WindowPromise();

    const storageDomains = new Storage(StorageNamespaces.CONNECTED_DOMAINS)
    const storageAddresses = new Storage(StorageNamespaces.USER_ADDRESSES);

    const domain = sender.origin;

    if (!domain) {
        return {
            error: getCustomError('ethRequestAccounts: invalid sender origin')
        }
    }

    let connectedAddresses = await storageDomains.get<string[]>(domain)

    const userSelectedAddress = await storageAddresses.get<string>('selectedAddress');

    if (!userSelectedAddress) {
        return {
            error: getCustomError('ethRequestAccounts: user selected address is null')
        }
    }

    if (connectedAddresses &&
        connectedAddresses.length) {
        // todo
    }

    if (!connectedAddresses || !connectedAddresses.length) {
        
        // TODO: pass flag to trigger/not-trigger popup menu
        // to be able to use this bg handler for internal purposes 
        const response =
            await window.getResponse<any>(
                getPopupPath(UIRoutes.ethConnectDApp.path),
                { method: payload.method }, true);

        if (response.error) return response;

        connectedAddresses = [userSelectedAddress];
    }

    await storageDomains.set(domain, connectedAddresses);

    return {
        result: [connectedAddresses[0]]
    }
}