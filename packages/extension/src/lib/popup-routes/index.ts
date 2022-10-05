export const getPopupPath = (page: string): string => {
    return `popup.html#/${page}`;
};

export const UIRoutes = {
    loading: {
        path: "loading",
        component: {},
        name: "loading",
    },
    unlock: {
        path: "unlock",
        component: {},
        name: "unlock",
    },
    ethSign: {
        path: "eth-sign",
        name: "ethSign",
        component: {},
    },
    ethSendTransaction: {
        path: "eth-send-transaction",
        name: "ethSendTransaction",
        component: {},
    },
    ethSignTypedData: {
        path: "eth-sign-typedData",
        name: "ethSignTypedData",
        component: {},
    },
    ethGetEncryptionKey: {
        path: "eth-get-encryption-key",
        name: "ethGetEncryptionKey",
        component: {},
    },
    ethDecrypt: {
        path: "eth-decrypt",
        name: "ethDecrypt",
        component: {},
    },
    ethConnectDApp: {
        path: "eth-connect-dapp",
        name: "ethConnectDApp",
        component: {},
    },
    ethHWVerify: {
        path: "eth-hw-verify",
        name: "ethHWVerify",
        component: {},
    }
};
