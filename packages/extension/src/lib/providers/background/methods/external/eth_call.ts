import { BigNumber, ethers, UnsignedTransaction, Wallet } from "ethers";
import { getCustomError } from "../../../../errors";
import { TransactionRequest } from '@ethersproject/abstract-provider'
import WindowPromise, { BackgroundOnMessageCallback, sendMessageFromBackgroundToBackground, sendRuntimeMessageToPopup } from "../../../../message-bridge/bridge";
import { EthereumRequest } from "../../../types";

export const ethCall: BackgroundOnMessageCallback<unknown, EthereumRequest<TransactionRequest>> = async (
    request,
    origin,
) => {    
    return makeRpcRequest(request, origin);
}