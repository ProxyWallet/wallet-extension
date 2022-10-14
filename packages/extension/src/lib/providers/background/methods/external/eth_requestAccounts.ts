import { getCustomError, getError } from "../../../../errors";
import WindowPromise, { BackgroundOnMessageCallback, sendRuntimeMessageToPopup } from "../../../../message-bridge/bridge";
import { RuntimeOnMessageResponse, RuntimePostMessagePayload, RuntimePostMessagePayloadType } from "../../../../message-bridge/types";
import { getPopupPath, UIRoutes } from "../../../../popup-routes";
import Storage, { StorageNamespaces } from "../../../../storage";
import { getBaseUrl } from "../../../../utils/url";
import { ErrorCodes, EthereumRequest } from "../../../types";
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
        if(request.triggerPopup) {
            const response =
                await window.getResponse<boolean>(
                    getPopupPath(UIRoutes.ethConnectDApp.path),
                    { method: payload.method }, true);
            
            if (response.error) throw response.error;
            if (!response.result) throw getError(ErrorCodes.userRejected);
        }

        connectedAddresses = [
            userSelectedAccount.undasContract && userSelectedAccount.isUndasContractSelected ?
                userSelectedAccount.undasContract :
                userSelectedAccount.address
        ];

        await storageDomains.set(domain, connectedAddresses);
    }

    const _selectedAddress = connectedAddresses.find( v=>
        v === (userSelectedAccount.isUndasContractSelected ? 
        userSelectedAccount.undasContract :
         userSelectedAccount.address)
    );

    return [
        _selectedAddress ? 
            _selectedAddress :
            connectedAddresses[0]
    ]
}