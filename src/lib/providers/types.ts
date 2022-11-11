import EventEmitter from "eventemitter3";

import type { Provider as EthereumProvider } from "./inject";

export enum InternalStorageNamespace {
  keyring = "KeyRing",
  persistentEvents = "PersistentEvents",
  domainState = "DomainState",
  evmAccountsState = "EVMAccountsState",
  substrateAccountsState = "SubstrateAccountsState",
  activityState = "ActivityState",
  marketData = "MarketData",
  cacheFetch = "CacheFetch",
  nftState = "NFTState",
  networksState = "NetworksState",
  settingsState = "SettingsState",
  tokensState = "TokensState",
}

export type StorageNamespace = InternalStorageNamespace;

export type SendMessageHandler = (
  message: string
) => Promise<any>;

export interface ProviderOptions {
  sendMessageHandler: SendMessageHandler;
}

export abstract class ProviderInterface extends EventEmitter {
  abstract name: string;
  abstract version: string;
  sendMessageHandler: SendMessageHandler;
  constructor(options: ProviderOptions) {
    super();
    this.sendMessageHandler = options.sendMessageHandler;
  }
  abstract handleMessage(msg: string): void;
}

export type handleIncomingMessage = (
  provider: Provider,
  message: string
) => void;

export type handleOutgoingMessage = (
  provider: Provider,
  message: string
) => Promise<any>;

export type Provider = EthereumProvider;

export interface ProviderRequestOptions {
  url: string;
  domain: string;
  faviconURL: string;
  title: string;
  tabId: number;
}
export interface ProviderRPCRequest extends RPCRequestType {
  options?: ProviderRequestOptions;
}

export interface ProviderError {
  message: string;
  code: number;
  data?: unknown;
}

export interface EthereumRequest<TParam = any> {
  method: string;
  params?: Array<TParam>;
}

export interface EthereumResponse {
  result?: any;
  error?: ProviderError;
}

export interface JsonRpcRequest {
  id: string;
  jsonrpc: "2.0";
  method: string;
  params?: any[];
}

export interface JsonRpcResponse {
  id: string;
  jsonrpc: "2.0";
  result?: unknown;
  error?: Error;
}

export enum EmitEvent {
  accountsChanged = "accountsChanged",
  chainChanged = "chainChanged",
  connect = "connect",
  disconnect = "disconnect",
  message = "message",
}

export enum MessageMethod {
  changeChainId = "changeChainId",
  changeAddress = "changeAddress",
  changeConnected = "changeConnected",
  subscription = "eth_subscription",
}

export interface ProviderConnectInfo {
  readonly chainId: string;
}

export interface ProviderMessage {
  method: MessageMethod;
  params: Array<any>;
}


export enum EnkryptProviderEventMethods {
  persistentEvents = "PersistentEvents",
}

export type HandleIncomingMessageFunction = (
  provider: Provider,
  message: string
) => void;

export enum ErrorCodes {
  userRejected = 4001,
  unauthorized = 4100,
  unsupportedMethod = 4200,
  disconnected = 4900,
  chainDisconnected = 4901,
}


export interface JSONError {
  error: ProviderError;
}

export interface RPCRequestType {
  method: string;
  params?: Array<any>;
}

export { EthereumProvider };


export interface OnMessageResponse {
  result?: string;
  error?: string;
}

export interface ProviderRequestOptions {
  url: string;
  domain: string;
  faviconURL: string;
  title: string;
  tabId: number;
}
export interface ProviderRPCRequest extends RPCRequestType {
  options?: ProviderRequestOptions;
}