import { SendMessageHandler } from "../providers/types";
import { WindowPostMessagePayload, WindowPostMessagePayloadType } from "./types";

export function windowOnMessage(
    callback: (msg: string) => Promise<void>,
    type: WindowPostMessagePayloadType,
    once: boolean = false) {
    const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.origin) return;

        const msg = WindowPostMessagePayload.fromJson(event.data);
        if (msg.type !== type) return;

        callback(msg.msg ?? '');
    }

    window.addEventListener('message', handleMessage, once);
}

export const sendMessageFromСsToBackground: SendMessageHandler = async (message) => {
    return new Promise((resolve, _) => {
        chrome.runtime.sendMessage(message, (response) => {
            resolve(response);
        })
    })
}

export const backgroundOnMessage = async (
    callback: (msg: string) => Promise<void>
) => {
    chrome.runtime.onMessage.addListener(function (
        request,
        sender,
        sendResponse
    ) {
        sendResponse({
            // todo
            foo: 'bar'
        });
    });
}

export const sendMessageFromWindowToCS: SendMessageHandler = async (message) => {
    return new Promise((resolve, _) => {
        windowOnMessage(
            async (msg) => {
                // console.log('inner handler', msg)
                resolve(msg)
            },
            WindowPostMessagePayloadType.RESPONSE,
            true
        )

        window.postMessage(new WindowPostMessagePayload({
            msg: message,
            type: WindowPostMessagePayloadType.REQUEST
        }).toJson());
    })
}
