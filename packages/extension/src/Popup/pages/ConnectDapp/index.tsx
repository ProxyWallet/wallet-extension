import React, { useEffect, useMemo, useState } from "react"
import Browser, { commands } from "webextension-polyfill";
import { getError } from "../../../lib/errors";
import { newPopupOnMessage } from "../../../lib/message-bridge/bridge";
import { PostMessageDestination, RuntimeOnMessageResponse, RuntimePostMessagePayload } from "../../../lib/message-bridge/types";
import { ErrorCodes, EthereumRequest } from "../../../lib/providers/types";

const getCurrentWindowActiveTabIndex = async () => {
    const currentWindowActiveTabs = await Browser.tabs.query({
        currentWindow: true,
        active: true,
    });

    if (!currentWindowActiveTabs.length)
        throw new Error();

    console.log('getCurrentWindowActiveTabIndex', currentWindowActiveTabs)
    return currentWindowActiveTabs[0].id;
}

type PromiseResult = boolean;

type PromiseResultResolve = (res: PromiseResult) => void;
type PromiseResultReject = (reason?: any) => void;

export const ConnectDapp: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const [reqPromise] = useState(
        () => {
            const funcs = {} as {
                reject: PromiseResultReject | undefined;
                resolve: PromiseResultResolve | undefined;
            }

            return {
                funcs,
                promise: new Promise<PromiseResult>((_resolve, _reject) => {
                    funcs.resolve = _resolve;
                    funcs.reject = _reject;
                })
            }
        });

    const discardConnect = () => {
        alert('discard')
        reqPromise.funcs?.reject?.(getError(ErrorCodes.userRejected));
    }

    const acceptConnect = () => {
        alert('accept')
        reqPromise.funcs.resolve?.(true);
    }

    const onTabMessage = async (req: RuntimePostMessagePayload<EthereumRequest>) => {
        setIsLoaded(true);
        return await reqPromise.promise;
    }

    useEffect(() => {
        newPopupOnMessage<PromiseResult>(onTabMessage)

        getCurrentWindowActiveTabIndex().then(tabId => {
            Browser.tabs.onRemoved.addListener(function tabListener(_tabId) {
                if (_tabId === tabId) {
                    Browser.tabs.onRemoved.removeListener(tabListener);
                    Browser.runtime.onMessage.removeListener(onTabMessage);
                }
            })
        })

        return () => {
            // discardConnect()
            Browser.runtime.onMessage.removeListener(onTabMessage);
        }
    }, [])


    return (<>
        {!isLoaded ?
            <>
                <span>Loading (Waiting for incoming request from BG)</span>
            </> :
            <>
                {/* <div style={{
                    display: 'inline-block'
                }}> */}
                <input value={'Discard'} type={'button'} onClick={discardConnect} />
                <input value={'Connect Dapp'} type={'button'} onClick={acceptConnect} />
                {/* </div> */}
            </>
        }

    </>)
}