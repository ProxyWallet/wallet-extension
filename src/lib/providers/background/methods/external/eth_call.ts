import { TransactionRequest } from '@ethersproject/abstract-provider'
import { BackgroundOnMessageCallback } from "../../../../message-bridge/bridge";
import { makeRpcRequest } from '../../../../requests/toRpcNode';
import { EthereumRequest } from "../../../types";

export const ethCall: BackgroundOnMessageCallback<unknown, EthereumRequest<TransactionRequest>> = async (
    request,
    origin,
) => {    
    return makeRpcRequest(request, origin);
}