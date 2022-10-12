import { ethers, UnsignedTransaction, Wallet } from "ethers";
import { getCustomError } from "../../../../errors";
import { TransactionRequest } from '@ethersproject/abstract-provider'
import WindowPromise, { BackgroundOnMessageCallback, sendMessageFromBackgroundToBackground, sendRuntimeMessageToPopup } from "../../../../message-bridge/bridge";
import { RuntimeOnMessageResponse, RuntimePostMessagePayload, RuntimePostMessagePayloadType } from "../../../../message-bridge/types";
import { getPopupPath, UIRoutes } from "../../../../popup-routes";
import Storage, { StorageNamespaces } from "../../../../storage";
import { getBaseUrl } from "../../../../utils/url";
import { EthereumRequest } from "../../../types";
import { UserAccountDTO } from "../internal/initializeWallet";

export const ethSendTransaction: BackgroundOnMessageCallback<string[], EthereumRequest<TransactionRequest>> = async (
    request,
    origin
) => {
    console.log('ethRequestAccounts');
    const payload = request.msg;
    const domain = getBaseUrl(origin);

    if (!payload || !payload.params || !payload.params.length) {
        throw getCustomError('ethSendTransaction: invalid data');
    }

    const [txRequest] = payload.params;

    const window = new WindowPromise();

    const storageAddresses = new Storage(StorageNamespaces.USER_WALLETS);

    if (!domain) {
        throw getCustomError('ethRequestAccounts: invalid sender origin')
    }

    const userSelectedAccount = await storageAddresses.get<UserAccountDTO>('selectedAccount');

    if (!userSelectedAccount) {
        throw getCustomError('ethRequestAccounts: user selected address is null')
    }

    // TODO: pass flag to trigger/not-trigger popup menu
    // to be able to use this bg handler for internal purposes 
    const response =
        // TODO: return only updated gas fees
        await window.getResponse<TransactionRequest>(
            getPopupPath(UIRoutes.ethSendTransaction.path),
            { method: payload.method, params: payload.params }, true);
            
    if (response.error) throw response.error;
    let tx = response.result ?? txRequest;

    const wallet = new Wallet(userSelectedAccount.privateKey ?? '');

    const signedTx = await wallet.signTransaction(tx);
    console.debug('signed tx');

    return sendMessageFromBackgroundToBackground<any, EthereumRequest>({
        method: 'eth_sendRawTransaction',
        params: [signedTx]
    }, RuntimePostMessagePayloadType.EXTERNAL,
    origin)
}