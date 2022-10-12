import { assert } from "chai";
import { getCustomError } from "../errors";
import { BackgroundOnMessageCallback } from "../message-bridge/bridge";
import { RuntimeOnMessageResponse, RuntimePostMessagePayloadType } from "../message-bridge/types";
import { ethRequestAccounts } from "../providers/background/methods/external/eth_requestAccounts";
import { bgIsLocked } from "../providers/background/methods/internal/bgIsLocked";
import { getUserAddresses } from "../providers/background/methods/internal/getUserAddresses";
import { initializeWallet } from "../providers/background/methods/internal/initializeWallet";
import { isWalletInitialized } from "../providers/background/methods/internal/isWalletInitialized";
import { EthereumRequest } from "../providers/types";
import { makeRpcRequest } from "../requests/toRpcNode";

export enum InternalBgMethods {
    IS_LOCKED = 'bgIsLocked',
    IS_WALLET_INITIALIZED = 'isWalletInitialized',
    INITIALIZE_WALLET = 'initializeWallet',
    GET_USER_ADDRESSES = 'getUserAddresses',
}

export const handleBackgroundMessage: BackgroundOnMessageCallback = async (request, domain) => {
    console.log('BG sender', domain);

    if (request.type === RuntimePostMessagePayloadType.EXTERNAL) {
        console.log('external', domain);

        return await handleExternal(request, domain);
    } else {
        console.log('internal', domain);

        return await handleInternal(request, domain);
    }
}

const handleExternal: BackgroundOnMessageCallback<any, EthereumRequest> = async (request, domain) => {
    if (!request.msg) throw getCustomError('Invalid payload')

    console.log('bg: handleExternal');

    if (
        request.msg.method == "eth_accounts" ||
        request.msg.method == "eth_requestAccounts" ||
        request.msg.method == "eth_coinbase"
    ) {
        return ethRequestAccounts(request, domain);
    } else {
        return makeRpcRequest(request, request.type)
    }

}

const handleInternal: BackgroundOnMessageCallback<any, EthereumRequest> = async (request, domain) => {
    if (!request.msg) throw getCustomError('Invalid payload')

    console.log('bg: handleInternal req', request);

    if (request.msg.method === InternalBgMethods.IS_LOCKED) {
        return bgIsLocked(request, domain);
    } else if (request.msg.method === InternalBgMethods.INITIALIZE_WALLET) {
        return initializeWallet(request, domain);
    } else if (request.msg.method === InternalBgMethods.IS_WALLET_INITIALIZED) {
        return isWalletInitialized(request, domain)
    } else if (request.msg.method === InternalBgMethods.GET_USER_ADDRESSES) {
        return getUserAddresses(request, domain)
    }
    else {
        console.log('bg: internal unknown method')
        throw getCustomError('Invalid background method');
    }
}