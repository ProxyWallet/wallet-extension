import EthereumProviderInject, { Provider } from "../lib/providers/inject";
import { WindowPostMessagePayload, WindowPostMessagePayloadType } from "../lib/message-bridge/types";
import { CS_WINDOW_BRIDGE, initWindowBridge, sendMessageFromWindowToCS as sendMessageHandler, windowOnMessage } from "../lib/message-bridge/bridge";

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
    const msg = args[0] as string;
    console.log('WindowToCS Response Injected')
    window.undasWallet?.provider?.handleMessage(msg);
}

CS_WINDOW_BRIDGE.windowSubscribeResponse(onWindowMessage)

EthereumProviderInject(window, {
    sendMessageHandler
})