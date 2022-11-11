import { ethers, Wallet } from "ethers";
import { getCustomError } from "../../../../errors";
import { TransactionRequest } from '@ethersproject/abstract-provider'
import WindowPromise, { BackgroundOnMessageCallback, sendMessageFromBackgroundToBackground } from "../../../../message-bridge/bridge";
import { RuntimePostMessagePayload, RuntimePostMessagePayloadType } from "../../../../message-bridge/types";
import { getPopupPath, UIRoutes } from "../../../../popup-routes";
import { storageGet, StorageNamespaces } from "../../../../storage";
import { normalizeURL } from "../../../../utils/url";
import { EthereumRequest } from "../../../types";
import { getCurrentNetwork } from "../../../../requests/toRpcNode";
import { Wallet__factory } from "../../../../../typechain";
import { AccountInfo, StorageKeys } from "../types";

export const ethSendTransaction: BackgroundOnMessageCallback<unknown, EthereumRequest<TransactionRequest>> = async (
    request,
    origin,
) => {
    const [method, txRequest] = tryGetPayload(request);

    const userSelectedAccount = await storageGet<AccountInfo>(StorageKeys.SELECTED_ACCOUNT, StorageNamespaces.USER_WALLETS);
    const { rpcProvider } = await getCurrentNetwork()

    if (!txRequest.from) {
        txRequest.from = userSelectedAccount.smartAccount;
    }

    if (txRequest.from === userSelectedAccount.smartAccount) {
        if (!userSelectedAccount.smartAccount) throw getCustomError("Proxy account was not deployed");

        const walletContract = Wallet__factory.connect(userSelectedAccount.smartAccount, rpcProvider);
        const populatedTx = await walletContract.populateTransaction.makeTransaction(txRequest.to!, txRequest.data!, 0);

        txRequest.data = populatedTx.data
        txRequest.to = populatedTx.to
    }

    await fillTransactionDetails(txRequest, rpcProvider, userSelectedAccount);

    if (request.triggerPopup) {
        const response =
            await new WindowPromise().getResponse<TransactionRequest>(
                getPopupPath(UIRoutes.ethSendTransaction.path),
                { method: method, params: [txRequest] }, true);

        if (response.error) throw response.error;
    }

    const wallet = Wallet.createRandom(); // TODO;
    const signedTx = await wallet.signTransaction(txRequest);
    
    return await sendMessageFromBackgroundToBackground<any, EthereumRequest>({
        method: 'eth_sendRawTransaction',
        params: [signedTx]
    },
        RuntimePostMessagePayloadType.EXTERNAL,
        origin
    )
}

async function fillTransactionDetails(txRequest: ethers.providers.TransactionRequest, rpcProvider: ethers.providers.JsonRpcProvider, userSelectedAccount: AccountInfo) {
    if (!txRequest.nonce) {
        txRequest.nonce = await rpcProvider.getTransactionCount(userSelectedAccount.masterAccount);
    }

    if (!txRequest.gasPrice) {
        const estimatedGasPrice = await rpcProvider.getFeeData();
        txRequest.gasPrice = estimatedGasPrice.gasPrice?.toHexString() ?? undefined;
    }

    if (!txRequest.gasLimit) {
        const estimatedGas = await rpcProvider.estimateGas(txRequest);
        txRequest.gasLimit = estimatedGas.toHexString();
    }
}

function tryGetPayload(request:RuntimePostMessagePayload<EthereumRequest<ethers.providers.TransactionRequest>>):Readonly<[string, ethers.providers.TransactionRequest]> {
    const payload = request.msg;
    const domain = normalizeURL(origin);
    const txRequest = payload?.params?.[0];

    if (!txRequest)
        throw getCustomError('ethSendTransaction: invalid data');
    if (!domain)
        throw getCustomError('ethRequestAccounts: invalid sender origin')
    if (!payload.method)
        throw getCustomError("ethSendTransaction: invalid method");
    if (!txRequest.to) 
        throw getCustomError("missing argument TO");
    if (!txRequest.data)
        throw getCustomError("missing argument Data");

    return [payload.method, txRequest];
}