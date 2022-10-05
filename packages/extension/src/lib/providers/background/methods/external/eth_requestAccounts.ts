import WindowPromise, { sendRuntimeMessageToPopup } from "../../../../message-bridge/bridge";
import { RuntimePostMessagePayload, RuntimePostMessagePayloadType } from "../../../../message-bridge/types";
import { UIRoutes } from "../../../../popup-routes";
import { EthereumRequest } from "../../../types";

export const ethRequestAccounts = async (payload: EthereumRequest, type: RuntimePostMessagePayloadType) => {
    console.log('ethRequestAccounts');
    const window = new WindowPromise();
    const accounts = await window.getResponse<string[]>(UIRoutes.ethConnectDApp.path, { method: payload.method }, true);
    // console.log('ethRequestAccounts accounts', accounts);
    return accounts; // TODO: implement
}