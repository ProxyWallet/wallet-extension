import WindowPromise, { sendRuntimeMessageToPopup } from "../../../../message-bridge/bridge";
import { RuntimePostMessagePayload, RuntimePostMessagePayloadType } from "../../../../message-bridge/types";
import { getPopupPath, UIRoutes } from "../../../../popup-routes";
import { EthereumRequest } from "../../../types";

export const ethRequestAccounts = async (payload: EthereumRequest, type: RuntimePostMessagePayloadType) => {
    console.log('ethRequestAccounts');
    const window = new WindowPromise();
    const response =  // ['0xEC227cFE7485b9423B7e2eb30b813c7b5413a0f2']
        await window.getResponse<string[]>(
            getPopupPath(UIRoutes.ethConnectDApp.path),
            { method: payload.method }, true);
    console.log('ethRequestAccounts response', response);
    return response.result;
}