import { getCustomError } from "../../../../errors";
import WindowPromise, { BackgroundOnMessageCallback, sendRuntimeMessageToPopup } from "../../../../message-bridge/bridge";
import { RuntimeOnMessageResponse, RuntimePostMessagePayload, RuntimePostMessagePayloadType } from "../../../../message-bridge/types";
import { getPopupPath, UIRoutes } from "../../../../popup-routes";
import Storage, { StorageNamespaces } from "../../../../storage";
import { EthereumRequest } from "../../../types";

export const ethRequestAccounts: BackgroundOnMessageCallback<string[], EthereumRequest> = async (
    request,
    domain
) => {
    console.log('ethRequestAccounts');
    const payload = request.msg;

    if (!payload) {
        throw getCustomError('ethRequestAccounts: invalid data');
    }

    const window = new WindowPromise();

    const storageDomains = new Storage(StorageNamespaces.CONNECTED_DOMAINS)
    const storageAddresses = new Storage(StorageNamespaces.USER_ADDRESSES);

    if (!domain) {
        throw getCustomError('ethRequestAccounts: invalid sender origin')
    }

    let connectedAddresses = await storageDomains.get<string[]>(domain)

    const userSelectedAddress = '0xEC227cFE7485b9423B7e2eb30b813c7b5413a0f2';  // await storageAddresses.get<string>('selectedAddress');

    if (!userSelectedAddress) {
        throw getCustomError('ethRequestAccounts: user selected address is null')
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

        if (response.error) throw response.error;

        connectedAddresses = [userSelectedAddress];
    }

    await storageDomains.set(domain, connectedAddresses);

    return [connectedAddresses[0]];
}