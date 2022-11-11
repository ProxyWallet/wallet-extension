import React, { useEffect, useMemo, useState } from "react"
import Browser, { commands } from "webextension-polyfill";
import { getError } from "../../../lib/errors";
import { newPopupOnMessage } from "../../../lib/message-bridge/bridge";
import { PostMessageDestination, RuntimeOnMessageResponse, RuntimePostMessagePayload } from "../../../lib/message-bridge/types";
import { ErrorCodes, EthereumRequest } from "../../../lib/providers/types";
import { usePagePromise } from "../../hooks/usePagePromise";

export const ConnectDapp: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const [pagePromise, pagePromiseFunctions] = usePagePromise<boolean>()

    const discardConnect = () => {
        alert('discard')
        pagePromiseFunctions.reject?.(getError(ErrorCodes.userRejected));
    }

    const acceptConnect = () => {
        pagePromiseFunctions.resolve?.(true);
    }

    const onTabMessage = async () => {
        setIsLoaded(true);
        return pagePromise;
    }

    useEffect(() => {
        newPopupOnMessage<boolean>(onTabMessage)

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