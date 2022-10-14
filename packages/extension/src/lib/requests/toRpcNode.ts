import { ethers } from "ethers";
import { getCustomError } from "../errors";
import { BackgroundOnMessageCallback } from "../message-bridge/bridge";
import { RuntimePostMessagePayload, RuntimePostMessagePayloadType } from "../message-bridge/types";
import { EthereumRequest, JsonRpcRequest } from "../providers/types";

export const makeRpcRequest: BackgroundOnMessageCallback<unknown, EthereumRequest> = async (
    request
) => {
    const req = request.msg;

    if (!req) {
        throw getCustomError('ethRequestAccounts: invalid data');
    }


    const curNetwork = await getCurrentNetwork();
    const res = await curNetwork.rpcProvider.send(req.method, req.params ?? []);
    console.log('rpc req result', res);
    return res;
}

export const getCurrentNetwork = async () => {
    // todo: take this from local storage
    const networkConfig = {
        jsonRpcUrl: 'https://goerli.infura.io/v3/abe28880fd324397924cf12a753fcc87',
        chainId: 5,
    }
    return {
        ...networkConfig,
        rpcProvider: new ethers.providers.JsonRpcProvider(networkConfig.jsonRpcUrl, networkConfig.chainId)
    }
}