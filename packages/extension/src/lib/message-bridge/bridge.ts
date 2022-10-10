import { EventEmitter } from "eventemitter3";
import Browser, { commands } from "webextension-polyfill";
import { getCustomError, getError } from "../errors";
import { handleBackgroundMessage, InternalBgMethods } from "../message-handlers/background-message-handler";
import { getPopupPath, UIRoutes } from "../popup-routes";
import { ErrorCodes, EthereumRequest, JsonRpcRequest, SendMessageHandler } from "../providers/types";
import { generateUuid } from "../utils/uuid";
import { PostMessageDestination, RuntimeOnMessageResponse, RuntimePostMessagePayload, RuntimePostMessagePayloadType, WindowCSMessageBridge, WindowPostMessagePayload, WindowPostMessagePayloadType } from "./types";

export const sendMessageToNewPopupWindow = async <TMsg = any, TReturn = any>(tabId: number, msg: TMsg) => {
    console.log('sendMessageToNewPopupWindow');
    const res = await Browser.tabs.sendMessage(tabId, msg);
    console.log('sendMessageToNewPopupWindow res', res)
    return res as RuntimeOnMessageResponse<TReturn>;
}

const sendRuntimeMessage = async <TMsg = any, TReturn = any>(destination: PostMessageDestination, msg: TMsg) => {
    return new Promise<TReturn>((resolve, _) => {
        chrome.runtime.sendMessage(new RuntimePostMessagePayload<TMsg>({
            msg: msg,
            destination: destination
        }), (response) => {
            console.log(`${destination} response`, response)
            resolve(response);
        })
    })
}

export const sendRuntimeMessageToBackground = <TMsg = any, TReturn = any>(msg: TMsg) => {
    return sendRuntimeMessage<TMsg, TReturn>(PostMessageDestination.BACKGROUND, msg);
}

export const sendRuntimeMessageToPopup = <TMsg = any, TReturn = any>(msg: TMsg) => {
    return sendRuntimeMessage<TMsg, TReturn>(PostMessageDestination.POPUP, msg);
}

export type BackgroundOnMessageCallback =
    (request: RuntimePostMessagePayload, sender: chrome.runtime.MessageSender) => Promise<any>

export type PopupOnMessageCallback =
    BackgroundOnMessageCallback

export type NewPopupWindowOnMessageCallback<TResult = any> =
    (request: RuntimePostMessagePayload) => Promise<TResult>

const runtimeOnMessage = (
    destination: PostMessageDestination,
    callback: BackgroundOnMessageCallback
) => {
    chrome.runtime.onMessage.addListener(function (
        request: RuntimePostMessagePayload,
        sender,
        sendResponse
    ) {
        if (request.destination !== destination) return;

        console.log(`${destination} runtimeOnMessage`, request)

        callback(request, sender)
            .then((r) => { console.log(`${destination} RUNTIME RESPONSE`, r); sendResponse(r) })
            .catch(sendResponse);

        return true;
    });
}

export const backgroundOnMessage = async (
    callback: BackgroundOnMessageCallback
) => {
    runtimeOnMessage(PostMessageDestination.BACKGROUND, callback)
}

export const popupOnMessage = async (
    callback: PopupOnMessageCallback
) => {
    runtimeOnMessage(PostMessageDestination.POPUP, callback)
}

export const newPopupOnMessage = async <TResult = any>(
    callback: NewPopupWindowOnMessageCallback<TResult>
) => {
    Browser.runtime.onMessage.addListener(async (
        message: RuntimePostMessagePayload,
    ) => {
        if (message.destination !== PostMessageDestination.NEW_POPUP) return;

        // return callback(message);
        try {
            const result = await callback(message);
            alert(result);
            return { result } as RuntimeOnMessageResponse
        } catch (error) {
            alert(error);

            return { error } as RuntimeOnMessageResponse
        }
    });
}


export const sendMessageFromBackgroundToBackground = async <TResp, TReq>(req: TReq, type: RuntimePostMessagePayloadType) => {
    return <TResp>handleBackgroundMessage(new RuntimePostMessagePayload({
        destination: PostMessageDestination.BACKGROUND,
        msg: req,
        type
    }))
}

const UNLOCK_PATH = getPopupPath(UIRoutes.unlock.path);

// let currentWindowId: number | undefined;

class WindowPromise {
    private _currentOpenedTab: number | undefined;

    private async getRawResponse<TMsg, TResult>(
        url: string,
        msg: TMsg,
        tabId: number
    ): Promise<RuntimeOnMessageResponse<TResult>> {
        return new Promise((resolve) => {
            Browser.tabs.onUpdated.addListener(function listener(_tabId, info, tab) {
                console.log('status: ', tab, url, _tabId, tabId)

                if (info.status === "complete" && _tabId === tabId && tab.url === url) {
                    console.log('status: completed')
                    resolve(
                        sendMessageToNewPopupWindow(
                            tabId,
                            new RuntimePostMessagePayload<TMsg>({
                                msg,
                                destination: PostMessageDestination.NEW_POPUP
                            }),
                        )
                    );
                    Browser.tabs.onUpdated.removeListener(listener);
                }
            });
            Browser.tabs.update(tabId, { url });
        });
    }

    private removeTab(tabId: number) {
        Browser.tabs.get(tabId).then((info) => {
            Browser.windows.remove(info.windowId!);
        });
    }

    async getResponse<TResult = any, TMsg = EthereumRequest>(
        url: string,
        msg: TMsg,
        unlockKeyring = false
    ): Promise<RuntimeOnMessageResponse<TResult>> {
        const loadingPath = '/' + getPopupPath(UIRoutes.loading.path);
        console.log('loadingPath', loadingPath)
        const windowInfo = await Browser.windows.create({

            url: loadingPath,
            type: "popup",
            focused: true,
            height: 600,
            width: 460,
        });
        console.log('window info', windowInfo)

        const tabId: number | undefined = windowInfo.tabs?.length
            ? windowInfo.tabs[0].id
            : 0;
        console.log('tabId', tabId)

        if (typeof tabId === "undefined") {
            return Promise.resolve({
                error: getCustomError("unknown error, no tabId"),
            });
        }
        const waitForWindow = async (): Promise<void> => {
            // eslint-disable-next-line no-empty
            while ((await Browser.tabs.get(tabId)).status !== "complete") { }
        };
        await waitForWindow();
        console.log('waitedForWindow')

        const monitorTabs = (): Promise<RuntimeOnMessageResponse> => {
            return new Promise((resolve) => {
                Browser.tabs.onRemoved.addListener(function tabListener(_tabId) {
                    console.log('onRemoved')
                    if (_tabId === tabId) {
                        console.log('onRemoved matched tab')
                        Browser.tabs.onRemoved.removeListener(tabListener);
                        resolve({
                            error: getError(ErrorCodes.userRejected),
                        });
                    }
                });
            });
        };

        const executePromise = async (): Promise<RuntimeOnMessageResponse> => {
            const isKeyRingLocked = await sendMessageFromBackgroundToBackground(
                JSON.stringify({
                    method: InternalBgMethods.IS_LOCKED,
                    params: [],
                } as EthereumRequest),
                RuntimePostMessagePayloadType.INTERNAL
            );

            console.log('isKeyRingLockedd', isKeyRingLocked);

            if (unlockKeyring && isKeyRingLocked) {
                console.log('unlock keyring', isKeyRingLocked);

                const unlockKeyring = await this.getRawResponse(
                    Browser.runtime.getURL(UNLOCK_PATH),
                    msg,
                    tabId
                );
                if (unlockKeyring.error) {
                    this.removeTab(tabId);
                    return unlockKeyring;
                } else {
                    return await this.getRawResponse(
                        Browser.runtime.getURL(url),
                        msg,
                        tabId
                    ).then((res) => {
                        this.removeTab(tabId);
                        return res;
                    });
                }
            }
            return await this.getRawResponse(
                Browser.runtime.getURL(url),
                msg,
                tabId
            ).then((res) => {
                this.removeTab(tabId);
                return res;
            });
        };

        console.log('wait for promises')

        return Promise.race([monitorTabs(), executePromise()]);
    }
}
export default WindowPromise;