import { BigNumber, ethers, UnsignedTransaction, Wallet } from "ethers";
import { getCustomError } from "../../../../errors";
import { TransactionRequest } from '@ethersproject/abstract-provider'
import WindowPromise, { BackgroundOnMessageCallback, sendMessageFromBackgroundToBackground, sendRuntimeMessageToPopup } from "../../../../message-bridge/bridge";
import { RuntimeOnMessageResponse, RuntimePostMessagePayload, RuntimePostMessagePayloadType } from "../../../../message-bridge/types";
import { getPopupPath, UIRoutes } from "../../../../popup-routes";
import Storage, { StorageNamespaces } from "../../../../storage";
import { getBaseUrl } from "../../../../utils/url";
import { EthereumRequest } from "../../../types";
import { UserAccountDTO } from "../internal/initializeWallet";
import { getCurrentNetwork } from "../../../../requests/toRpcNode";

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

    const { rpcProvider } = await getCurrentNetwork()

    if (!txRequest.nonce) {
        txRequest.nonce = await rpcProvider.getTransactionCount(userSelectedAccount.address)
    }

    if (!txRequest.gasPrice) {
        const estimatedGasPrice = await rpcProvider.getFeeData();

        txRequest.gasPrice = estimatedGasPrice.gasPrice?.toHexString() ?? undefined;
    }

    if (!txRequest.gasLimit) {
        const estimatedGas = await rpcProvider.estimateGas(txRequest).catch(err => BigNumber.from(1_000_000));
        txRequest.gasLimit = (txRequest as any).gas?.toString() ?? estimatedGas.toHexString();
    }

    if (!txRequest.from) {
        txRequest.from = userSelectedAccount.address;
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

    delete (tx as any).gas;

    const wallet = new Wallet(userSelectedAccount.privateKey ?? '');

    const signedTx = await wallet.signTransaction(tx);

    return sendMessageFromBackgroundToBackground<any, EthereumRequest>({
        method: 'eth_sendRawTransaction',
        params: [signedTx]
    },
        RuntimePostMessagePayloadType.EXTERNAL,
        origin
    )
}