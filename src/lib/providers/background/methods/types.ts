type address = string;

export enum StorageKeys {
    ACCOUNTS = 'accounts',
    SELECTED_ACCOUNT = 'selectedAccount',
    MNEMONIC = 'mnemonic',
}

export enum Errors {
    PAYLOAD = 'Invalid payload',
    ALREADY_EXECUTED = 'Operation already executed previously',
}

export type AccountState = {
    isConnected: boolean
    isActive: boolean,
    isSmartContractSelected: boolean
}

export type AccountInfo = {
    state: AccountState,
    isImported: boolean,
    masterAccount: address,
    smartAccount: address | undefined,
}

export type AccountCredentials = {
    mnemonicDeriveIndex?: number,
    privateKey?: string,
}

export type AccountInfoCredentials = AccountInfo & AccountCredentials;

export type DeployedContractResult = {
    address: address;
    txHash: string
}

export type InitializeWalletPayload = {
    mnemonic: string;
    walletPassword: string
}

export type SwitchAccountsRequestPayload = {
   address: address,
}

export type SelectedChain = { 
    chainId: number
}