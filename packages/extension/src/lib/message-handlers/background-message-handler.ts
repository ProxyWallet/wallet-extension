import { assert } from "chai";
import { getCustomError } from "../errors";
import { BackgroundOnMessageCallback } from "../message-bridge/bridge";
import { RuntimePostMessagePayloadType } from "../message-bridge/types";
import { ethRequestAccounts } from "../providers/background/methods/external/eth_requestAccounts";
import { bgIsLocked } from "../providers/background/methods/internal/bgIsLocked";
import { EthereumRequest } from "../providers/types";
import { makeRpcRequest } from "../requests/toRpcNode";

export enum InternalBgMethods {
    IS_LOCKED = 'bgIsLocked'
}

export const handleBackgroundMessage: BackgroundOnMessageCallback = async (request, sender) => {
    console.log('BG sender', sender);

    if (request.type === RuntimePostMessagePayloadType.EXTERNAL) {
        console.log('external', sender);

        return await handleExternal(request, sender);
    } else {
        console.log('internal', sender);

        return await handleInternal(request, sender);
    }
}

const handleExternal: BackgroundOnMessageCallback = async (request, sender) => {
    // assert(request.type === RuntimePostMessagePayloadType.EXTERNAL, 'invalid payload type');

    console.log('bg: handleExternal');

    const payload = JSON.parse(request.msg ?? '{}') as EthereumRequest;

    console.log('ethereum request', payload);

    if (
        payload.method == "eth_accounts" ||
        payload.method == "eth_requestAccounts" ||
        payload.method == "eth_coinbase"
    ) {
        return ethRequestAccounts(payload, request.type);
    } else {
        return makeRpcRequest(payload, request.type)
    }

}

const handleInternal: BackgroundOnMessageCallback = async (request, sender) => {
    // assert(request.type === RuntimePostMessagePayloadType.INTERNAL, 'invalid payload type');

    console.log('bg: handleInternal req', request);

    const payload = JSON.parse(request.msg ?? '{}') as EthereumRequest;

    console.log('bg: handleInternal', payload);

    if (payload.method === InternalBgMethods.IS_LOCKED) {
        return bgIsLocked(payload);
    }
    else {
        console.log('bg: internal unknown method')
        return getCustomError('Invalid background method');
    }
}