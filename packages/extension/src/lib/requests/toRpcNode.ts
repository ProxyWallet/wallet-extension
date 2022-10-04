import { ethers } from "ethers";
import { getCustomError } from "../errors";
import { RuntimePostMessagePayload, RuntimePostMessagePayloadType } from "../message-bridge/types";
import { EthereumRequest, JsonRpcRequest } from "../providers/types";

export const makeRpcRequest = async (payload: EthereumRequest, type: RuntimePostMessagePayloadType) => {
    console.log('makeRpcRequest', payload);

    const req = payload;
    if (!req) return getCustomError('MakeRpcRequest: Invalid payload');

    const curNetwork = await getCurrentNetwork();
    const res = await curNetwork.rpcProvider.send(req.method, req.params ?? []);
    console.log('rpc req result', res);
    return res;
}

const getCurrentNetwork = async () => {
    // todo: take this from local storage
    const networkConfig = {
        jsonRpcUrl: 'https://mainnet.infura.io/v3/abe28880fd324397924cf12a753fcc87',
        chainId: 1,
    }
    return {
        ...networkConfig,
        rpcProvider: new ethers.providers.JsonRpcProvider(networkConfig.jsonRpcUrl, networkConfig.chainId)
    }
}