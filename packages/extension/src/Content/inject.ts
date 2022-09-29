import EthereumProviderInject from "../providers/inject";

EthereumProviderInject(window, {
    sendMessageHandler: async (msg) => {
        console.log('Ethereum provider send handle', msg)
    }
})