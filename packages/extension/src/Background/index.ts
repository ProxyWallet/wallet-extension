import Browser from "webextension-polyfill";
import { backgroundOnMessage } from "../lib/message-bridge/bridge";
import { handleBackgroundMessage } from "../lib/message-handlers/background-message-handler";
import { getPopupPath, UIRoutes } from "../lib/popup-routes";

backgroundOnMessage(handleBackgroundMessage)

chrome.runtime.onInstalled.addListener(function () {
    alert('Extension installed');

    Browser.tabs.create({
        active: true,
        url: getPopupPath(UIRoutes.initializeWallet.path)
    })

    return false;
});