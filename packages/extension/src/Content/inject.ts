import EthereumProviderInject, { Provider } from "../lib/providers/inject";
import { WindowPostMessagePayload, WindowPostMessagePayloadType } from "../lib/message-bridge/types";
import { sendMessageFromWindowToCS as sendMessageHandler, windowOnMessage } from "../lib/message-bridge/bridge";

declare global {
    interface Window {
        undasWallet: {
            provider?: Provider
        }
    }
}

window.undasWallet = {};

windowOnMessage(
    async (msg) => {
        window.undasWallet?.provider?.handleMessage(msg);
    },
    WindowPostMessagePayloadType.RESPONSE
)

EthereumProviderInject(window, {
    sendMessageHandler
})