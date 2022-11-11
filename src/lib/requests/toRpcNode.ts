import { ethers } from "ethers";
import { getCustomError } from "../errors";
import { BackgroundOnMessageCallback } from "../message-bridge/bridge";
import { EthereumRequest } from "../providers/types";

export const makeRpcRequest: BackgroundOnMessageCallback<unknown, EthereumRequest> = async (
    request
) => {
    const req = request.msg;

    if (!req) {
        throw getCustomError('ethRequestAccounts: invalid data');
    }

    const curNetwork = await getCurrentNetwork();
    const res = await curNetwork.rpcProvider.send(req.method, req.params ?? []);
    return res;
}

export const getCurrentNetwork = async () => { // TODO
    const networkConfig = {
        jsonRpcUrl: 'https://goerli.infura.io/v3/abe28880fd324397924cf12a753fcc87',
        chainId: 5,
    }
    return {
        ...networkConfig,
        rpcProvider: new ethers.providers.JsonRpcProvider(networkConfig.jsonRpcUrl, networkConfig.chainId)
    }
}