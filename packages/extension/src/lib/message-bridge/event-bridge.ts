import { SendMessageHandler } from "../providers/types";
import { generateUuid } from "../utils/uuid";
import { WindowCSMessageBridge, WindowPostMessagePayload, WindowPostMessagePayloadType } from "./types";

export function windowOnMessage(
    callback: (msg: WindowPostMessagePayload) => Promise<void>) {

    const handleMessage = (event: MessageEvent) => {
        console.log('handleMessage', event.data)
        // if (event.origin !== window.origin) return;
        const msg = WindowPostMessagePayload.fromJson(event.data);

        if (msg) {
            callback(msg);
        } else {
            console.debug('bridge: cannot parse msg')
        }
    }

    window.addEventListener('message', handleMessage, false);
}


export let CS_WINDOW_BRIDGE: WindowCSMessageBridge;

export const initWindowBridge = (prefix?: string) => {
    CS_WINDOW_BRIDGE = new WindowCSMessageBridge(prefix);
}

export const sendMessageFromWindowToCS: SendMessageHandler = async (message) => {
    return new Promise((resolve, _) => {
        const reqUid = generateUuid();

        const resp = (...args: any[]) => {
            const payload = args[0] as WindowPostMessagePayload;

            if (!payload ||
                payload.reqUid !== reqUid ||
                payload.type !== WindowPostMessagePayloadType.RESPONSE) {
                console.debug('sendMessageFromWindowToCS: invalid resp payload');
                return;
            }

            const msg = payload.msg;

            console.log('WindowToCS response', msg)

            CS_WINDOW_BRIDGE.windowUnSubscribeResponse(resp, this);

            resolve(msg)
        }

        CS_WINDOW_BRIDGE.windowSubscribeResponse(resp, this);

        window.postMessage(new WindowPostMessagePayload({
            msg: message,
            type: WindowPostMessagePayloadType.REQUEST,
            reqUid
        }).toJson());
    })
}
