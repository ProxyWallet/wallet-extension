import EthereumProviderInject, { Provider } from "../lib/providers/inject";
import { WindowPostMessagePayload } from "../lib/message-bridge/types";
import { CS_WINDOW_BRIDGE, initWindowBridge, sendMessageFromWindowToCS as sendMessageHandler } from "../lib/message-bridge/event-bridge";

declare global {
    interface Window {
        undasWallet: {
            provider?: Provider
        }
    }
}

window.undasWallet = {};

initWindowBridge('inject');

const onWindowMessage = async (...args: any[]) => {
    const msg = args[0] as WindowPostMessagePayload;
    console.log('WindowToCS Response Injected', args)
    window.undasWallet?.provider?.handleMessage(msg.msg ?? '');
}

CS_WINDOW_BRIDGE.windowSubscribeResponse(onWindowMessage)

EthereumProviderInject(window, {
    sendMessageHandler
})