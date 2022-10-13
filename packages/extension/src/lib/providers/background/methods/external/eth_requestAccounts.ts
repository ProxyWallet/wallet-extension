import { getCustomError } from "../../../../errors";
import WindowPromise, { BackgroundOnMessageCallback, sendRuntimeMessageToPopup } from "../../../../message-bridge/bridge";
import { RuntimeOnMessageResponse, RuntimePostMessagePayload, RuntimePostMessagePayloadType } from "../../../../message-bridge/types";
import { getPopupPath, UIRoutes } from "../../../../popup-routes";
import Storage, { StorageNamespaces } from "../../../../storage";
import { getBaseUrl } from "../../../../utils/url";
import { EthereumRequest } from "../../../types";
import { UserAccount, UserSelectedAccount } from "../internal/initializeWallet";

export const ethRequestAccounts: BackgroundOnMessageCallback<string[], EthereumRequest> = async (
    request,
    origin
) => {
    console.log('ethRequestAccounts');
    const payload = request.msg;
    const domain = getBaseUrl(origin);

    if (!payload) {
        throw getCustomError('ethRequestAccounts: invalid data');
    }

    const window = new WindowPromise();

    const storageDomains = new Storage(StorageNamespaces.CONNECTED_DOMAINS)
    const storageAddresses = new Storage(StorageNamespaces.USER_WALLETS);

    if (!domain) {
        throw getCustomError('ethRequestAccounts: invalid sender origin')
    }

    let connectedAddresses = await storageDomains.get<string[]>(domain)

    const userSelectedAccount = await storageAddresses.get<UserSelectedAccount>('selectedAccount');

    if (!userSelectedAccount) {
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

        connectedAddresses = [userSelectedAccount.address];
    }

    await storageDomains.set(domain, connectedAddresses);

    return [connectedAddresses[0]];
}