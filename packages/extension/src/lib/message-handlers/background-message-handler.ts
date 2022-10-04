import { BackgroundOnMessageCallback } from "../message-bridge/bridge";
import { ethRequestAccounts } from "../providers/background/methods/eth_requestAccounts";
import { EthereumRequest } from "../providers/types";
import { makeRpcRequest } from "../requests/toRpcNode";

export const handleBackgroundMessage: BackgroundOnMessageCallback = async (request, sender) => {
    console.log('BG sender', sender);

    const payload = JSON.parse(request.msg ?? '{}') as EthereumRequest;

    console.log('ethereum request', payload);

    if (
        payload.method === "eth_accounts" ||
        payload.method === "eth_requestAccounts" ||
        payload.method === "eth_coinbase"
    ) {
        return ethRequestAccounts(payload, request.type);
    } else {
        return makeRpcRequest(payload, request.type)
    }
}