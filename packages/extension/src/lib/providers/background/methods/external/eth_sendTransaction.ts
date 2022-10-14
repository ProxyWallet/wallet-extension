import { BigNumber, ethers, UnsignedTransaction, Wallet } from "ethers";
import { getCustomError } from "../../../../errors";
import { TransactionRequest } from '@ethersproject/abstract-provider'
import WindowPromise, { BackgroundOnMessageCallback, sendMessageFromBackgroundToBackground, sendRuntimeMessageToPopup } from "../../../../message-bridge/bridge";
import { RuntimeOnMessageResponse, RuntimePostMessagePayload, RuntimePostMessagePayloadType } from "../../../../message-bridge/types";
import { getPopupPath, UIRoutes } from "../../../../popup-routes";
import Storage, { StorageNamespaces } from "../../../../storage";
import { getBaseUrl } from "../../../../utils/url";
import { EthereumRequest } from "../../../types";
import { UserAccount, UserSelectedAccount } from "../internal/initializeWallet";
import { getCurrentNetwork } from "../../../../requests/toRpcNode";
import { Wallet__factory } from "../../../../../typechain";

export const ethSendTransaction: BackgroundOnMessageCallback<unknown, EthereumRequest<TransactionRequest>> = async (
    request,
    origin,
) => {
    console.log('ethRequestAccounts');
    const payload = request.msg;
    const domain = getBaseUrl(origin);

    if (!payload || !payload.params || !payload.params.length) {
        throw getCustomError('ethSendTransaction: invalid data');
    }

    const [txRequest] = payload.params;

    console.log('Origin TxRequest', txRequest);
    const window = new WindowPromise();

    const storageAddresses = new Storage(StorageNamespaces.USER_WALLETS);


    if (!domain) {
        throw getCustomError('ethRequestAccounts: invalid sender origin')
    }

    const userSelectedAccount = await storageAddresses.get<UserSelectedAccount>('selectedAccount');

    if (!userSelectedAccount) {
        throw getCustomError('ethRequestAccounts: user selected address is null')
    }

    const { rpcProvider } = await getCurrentNetwork()

    if (!txRequest.from) {
        txRequest.from = userSelectedAccount.address;
    }

    const isThroughUndasProxy = 
        userSelectedAccount.undasContract &&
            userSelectedAccount.isUndasContractSelected &&
            txRequest.to !== userSelectedAccount.undasContract

    if (isThroughUndasProxy) {
        txRequest.from = userSelectedAccount.address;

        const walletContract = Wallet__factory.connect(userSelectedAccount.undasContract, rpcProvider);

        if (!txRequest.to) throw getCustomError("missing argument");

        console.log('tx.to', txRequest.to)
        console.log('tx.datatx.data', txRequest.data)

        const populatedTx = await walletContract.populateTransaction.makeTransaction(txRequest.to, txRequest.data ?? '',
            txRequest.value ?? '0');

        console.log('populatedTx', populatedTx)

        txRequest.data = populatedTx.data
        txRequest.to = populatedTx.to
    }

    if (!txRequest.nonce) {
        txRequest.nonce = await rpcProvider.getTransactionCount(userSelectedAccount.address)
    }

    if (!txRequest.gasPrice) {
        const estimatedGasPrice = await rpcProvider.getFeeData();

        txRequest.gasPrice = estimatedGasPrice.gasPrice?.toHexString() ?? undefined;
    }


    if (!txRequest.gasLimit) {
        const estimatedGas = await rpcProvider.estimateGas(txRequest).catch(err => {console.error(err); return BigNumber.from(1_000_000)});
        txRequest.gasLimit =
            // (txRequest as any).gas?.toString() ??
            estimatedGas.toHexString();
    }



    let tx = txRequest;
    console.log('TX DATA', tx.data)
    console.log('TX DATA', userSelectedAccount.isUndasContractSelected)

    if (request.triggerPopup) {
        // TODO: pass flag to trigger/not-trigger popup menu
        // to be able to use this bg handler for internal purposes 
        const response =
            // TODO: return only updated gas fees
            await window.getResponse<TransactionRequest>(
                getPopupPath(UIRoutes.ethSendTransaction.path),
                { method: payload.method, params: [tx] }, true);

        if (response.error) throw response.error;
        tx = response.result ?? tx;
        console.log('trueTX', tx)
    }

    if(isThroughUndasProxy)
        delete tx.value;

    delete (tx as any).gas;

    const wallet = new Wallet(userSelectedAccount.privateKey ?? '');
    console.log('defaurl tx', tx)

    const signedTx = await wallet.signTransaction(tx);
    console.log('signedTx', signedTx)

    return sendMessageFromBackgroundToBackground<any, EthereumRequest>({
        method: 'eth_sendRawTransaction',
        params: [signedTx]
    },
        RuntimePostMessagePayloadType.EXTERNAL,
        origin
    )
}