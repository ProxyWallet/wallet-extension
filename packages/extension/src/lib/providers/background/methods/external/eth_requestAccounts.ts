import { getCustomError, getError } from "../../../../errors";
import WindowPromise, { BackgroundOnMessageCallback } from "../../../../message-bridge/bridge";
import { RuntimePostMessagePayload } from "../../../../message-bridge/types";
import { getPopupPath, UIRoutes } from "../../../../popup-routes";
import { storageGet, StorageNamespaces, storageSet } from "../../../../storage";
import { normalizeURL } from "../../../../utils/url";
import { ErrorCodes, EthereumRequest } from "../../../types";
import { AccountInfo, StorageKeys } from "../types";

export const ethRequestAccounts: BackgroundOnMessageCallback<string[], EthereumRequest> = async (
    request,
    origin
) => {
    const { domain, window, payload } = tryGetPayload(request, origin);

    const connectedAddresses = await storageGet<string[]>(domain, StorageNamespaces.CONNECTED_DOMAINS);
    const userSelectedAccount = await storageGet<AccountInfo>(StorageKeys.SELECTED_ACCOUNT, StorageNamespaces.USER_WALLETS);

    if (!connectedAddresses || !connectedAddresses.length) {
        if(request.triggerPopup) {
            const response =
                await window.getResponse<boolean>(
                    getPopupPath(UIRoutes.ethConnectDApp.path),
                    { method: payload.method }, true);
            
            if (response.error) throw response.error;
            if (!response.result) throw getError(ErrorCodes.userRejected);
        }

        await storageSet(domain, [userSelectedAccount.smartAccount!], StorageNamespaces.CONNECTED_DOMAINS);
    }

    return connectedAddresses ?? [userSelectedAccount.smartAccount!];
}

function tryGetPayload(request: RuntimePostMessagePayload<EthereumRequest<any>>, origin: string) {
    const payload = request.msg;
    const domain = normalizeURL(origin);

    if (!payload) {
        throw getCustomError('ethRequestAccounts: invalid data');
    }

    const window = new WindowPromise();

    if (!domain) {
        throw getCustomError('ethRequestAccounts: invalid sender origin');
    }
    return { domain, window, payload };
}
