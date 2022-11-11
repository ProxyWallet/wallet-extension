import { BrowserStorageArea } from "./types";
import LocalStorage from "./local-forage";
import { getCustomError } from "../errors";

export enum StorageNamespaces {
  CONNECTED_DOMAINS = 'connected-domains',
  USER_ADDRESSES = 'user-addresses',
  USER_WALLETS = 'user-wallets',
  WALLET_CONTRACT= 'wallet-contract'
}

export interface StorageOptions {
  storage?: BrowserStorageArea;
}

const getStorage = (namespace:string) => new LocalStorage(namespace);

export async function storageGet<TReturn>(key: string, namespace: string) {
  const vals = await getStorage(namespace).get(namespace);
  let val = vals?.[namespace]?.[key]

  if (val)
    return val as TReturn;
  else 
    throw getCustomError(`${key} at ${namespace} does not exist`);
}

export async function storageGetAllKeys(namespace: string) {
  const vals = await getStorage(namespace).get(namespace);
  if (vals && vals[namespace])
    return Object.keys(vals[namespace]);
  return [];
}

export async function storageSet<TValue>(key: string, val: TValue, namespace: string) {
  const storage = new LocalStorage(namespace);
  
  let vals = await storage.get(namespace);
  vals = vals[namespace] ? vals[namespace] : {};
  vals[key] = val;
  return storage.set({
    [namespace]: vals,
  });
}

export async function remove(key: string, namespace: string) {
  let storage = getStorage(namespace);
  let vals = await storage.get(namespace);
  vals = vals[namespace] ? vals[namespace] : {};
  delete vals[key];
  return storage.set({
    [namespace]: vals,
  });
}

export async function clear(namespace: string) {
  return getStorage(namespace).remove(namespace);
}