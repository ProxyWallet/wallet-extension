import React, { useEffect, useState } from "react"
import Browser, { commands } from "webextension-polyfill";
import { PostMessageDestination, RuntimePostMessagePayload } from "../../../lib/message-bridge/types";
import { EthereumRequest } from "../../../lib/providers/types";

// const getCurrentWindowActiveTabIndex = async () => {
//     const currentWindowActiveTabs = await Browser.tabs.query({
//         currentWindow: true,
//         active: true,
//     });

//     if (!currentWindowActiveTabs.length)
//         throw new Error();

//     console.log('getCurrentWindowActiveTabIndex', currentWindowActiveTabs)
//     return currentWindowActiveTabs[0].id;
// }

export const ConnectDapp: React.FC = () => {
    const locationHref = window.location.href;
    console.log('location href', locationHref)
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    type PromiseResult = string;
    type PromiseResultResolve = (res: any) => void;
    type PromiseResultReject = (reason?: any) => void;

    let reqResolve: PromiseResultResolve;
    let reqReject: PromiseResultReject;

    const reqPromise: Promise<PromiseResult> = new Promise((resolve, reject) => {
        reqResolve = resolve
        reqReject = reject;
    })

    const onTabMessage = async (msg: RuntimePostMessagePayload<EthereumRequest>, sender: Browser.Runtime.MessageSender) => {
        if (msg.destination !== PostMessageDestination.NEW_POPUP) return;
        // alert(JSON.stringify(msg));
        setIsLoaded(true);
        return reqPromise;
    }

    const discardConnect = () => {
        alert('discard connect')
        reqReject();
    }
    const acceptConnect = () => {
        alert('accept connect')
        reqResolve(['0xEC227cFE7485b9423B7e2eb30b813c7b5413a0f2']);
    }

    useEffect(() => {
        Browser.runtime.onMessage.addListener(onTabMessage)

        // getCurrentWindowActiveTabIndex()
        //     .then(tabId => Browser.tabs.update(tabId, { url: locationHref })
        //         .then(v => console.log('tab updated', v)));

        return () => {
            Browser.runtime.onMessage.removeListener(onTabMessage)
        }
    }, [])


    return (<>
        {!isLoaded ?
            <>
                <span>Loading (Waiting for incoming request from BG)</span>
            </> :
            <>
                <div style={{
                    display: 'inline-block'
                }}>
                    <button onClick={discardConnect}>Discard</button>
                    <button onClick={acceptConnect}>Connect Dapp</button>
                </div>
            </>
        }

    </>)
}