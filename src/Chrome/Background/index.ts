import Browser from "webextension-polyfill";
import { backgroundOnMessage } from "../../Lib/message-bridge/bridge";
import { handleBackgroundMessage } from "../../Lib/message-handlers/background-message-handler";
import { getPopupPath, UIRoutes } from "../../Lib/popup-routes";

backgroundOnMessage(handleBackgroundMessage)

Browser.runtime.onInstalled.addListener(function (details) {
    if (details.reason !== 'install') { return; }

    setTimeout(() => {
        Browser.tabs.create({
            active: true,
            url: getPopupPath(UIRoutes.initializeWallet.path)
        })
    }, 1000)
});