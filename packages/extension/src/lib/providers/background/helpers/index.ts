import Browser from "webextension-polyfill"
import { sendMessageToTab } from "../../../message-bridge/bridge"
import { PostMessageDestination } from "../../../message-bridge/types"
import { getBaseUrl } from "../../../utils/url"
import { EthereumRequest, MessageMethod } from "../../types"
import { UserAccount } from "../methods/internal/initializeWallet"

export const sendAccountChangedToTab = async (
    tabDomain: string,
    switchTo: string | undefined
) => {
    const tabs = (await Browser.tabs.query({}) ?? []).filter(v=>getBaseUrl(v.url ?? '') === tabDomain);

    tabs.forEach(tab => {
        if (!tab || !tab.id) return;

        sendMessageToTab<EthereumRequest<string | undefined>>(
            tab.id,
            PostMessageDestination.WINDOW,
            {
                method: MessageMethod.changeAddress,
                params: [switchTo]
            }
        )    
    });
    
}

// export const sendAccountChangedToAllTabs = async (
//     accountChangedTo: UserAccount,
//     changedToContract: boolean
// ) => {
//     Browser.tabs.query({}).then(tabs => {
//         tabs?.forEach(t => {
//             if (!t || !t.id) return;

//             sendMessageToTab<EthereumRequest<string>>(
//                 t.id,
//                 PostMessageDestination.WINDOW,
//                 {
//                     method: MessageMethod.changeAddress,
//                     params: [changedToContract ? accountChangedTo.undasContract : accountChangedTo.address]
//                 }
//             )  
//         })
//     })
// }

