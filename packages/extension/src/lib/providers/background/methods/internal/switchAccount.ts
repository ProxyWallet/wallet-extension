import { getAddress } from "ethers/lib/utils";
import { getCustomError } from "../../../../errors";
import { BackgroundOnMessageCallback } from "../../../../message-bridge/bridge";
import Storage, { StorageNamespaces } from "../../../../storage";
import { getBaseUrl } from "../../../../utils/url";
import { EthereumRequest } from "../../../types";
import { UserAccount, UserSelectedAccount } from "./initializeWallet";


export type SwitchAccountsRequestPayloadDTO = {
    switchTo: string;
    toContract: boolean
}

export const switchAccount: BackgroundOnMessageCallback<string, EthereumRequest<SwitchAccountsRequestPayloadDTO>> = async (
    payload, _
) => {
    if (!payload.msg || !payload.msg.params) {
        throw getCustomError('Invalid payload');
    }

    const [switchToAccount] = payload.msg.params;

    const storageWallets = new Storage(StorageNamespaces.USER_WALLETS);

    // TODO: move keys to enum
    const accounts = await storageWallets.get<UserAccount[]>('accounts');
    const selectedAccount = await storageWallets.get<UserSelectedAccount>('selectedAccount');

    if (!accounts || !accounts.length) {
        throw getCustomError('getUserAddresses: 0 accounts');
    }

    if (selectedAccount?.address === getAddress(switchToAccount.switchTo) &&
        selectedAccount.isUndasContractSelected === switchToAccount.toContract
    ) {
        throw getCustomError('Same account');
    }

    const accountToSwitch = accounts.find(v => getAddress(v.address) === getAddress(switchToAccount.switchTo));

    if (!accountToSwitch) {
        throw getCustomError('Unknown account to switch');
    }

    if (switchToAccount.toContract && !accountToSwitch.undasContract) {
        throw getCustomError('Undas contract is not deployed');
    }

    await storageWallets.set<UserSelectedAccount>('selectedAccount', {
        ...accountToSwitch,
        isUndasContractSelected: switchToAccount.toContract
    })

    return accountToSwitch.address
}