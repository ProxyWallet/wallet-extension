import { RuntimePostMessagePayload, RuntimePostMessagePayloadType } from "../../../message-bridge/types";
import { EthereumRequest } from "../../types";

export const ethRequestAccounts = async (payload: EthereumRequest, type: RuntimePostMessagePayloadType) => {
    console.log('ethRequestAccounts');
    return ['0xEC227cFE7485b9423B7e2eb30b813c7b5413a0f2'] // TODO: implement
}