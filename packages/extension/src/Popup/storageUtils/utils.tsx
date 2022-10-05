import { ethers } from 'ethers';
import LocalForageLib from 'localforage';
import Storage from '../../lib/storage/index';
import LocalForage from '../../lib/storage/local-forage';
// @ts-ignore
import DummyDriver from '../../lib/storage/dummyDriver';
var CryptoJS = require('crypto-js');

LocalForageLib.defineDriver(DummyDriver);
const localForage = new LocalForage('walletUndas');
const walletStorage = new Storage('walletStorage', { storage: localForage });

export async function createPasswordForMnemonic(
  mnemonicPhrase: string,
  password: any
) {
  const wallet = ethers.Wallet.fromMnemonic(mnemonicPhrase);
  const cryptedPrivateKey = CryptoJS.AES.encrypt(
    wallet.privateKey,
    password
  ).toString();
  await walletStorage.set('AesPk', cryptedPrivateKey);
  console.log('32131231',await walletStorage.get('AesPk'));

}

export async function decryptPrivatKeyViaPassword(password: any) {
  const cryptedPk = await walletStorage.get('AesPk');

  if (!cryptedPk) return console.log('!aesPk');

  const decryptedPrivateKey = CryptoJS.AES.decrypt(
    cryptedPk,
    password
  ).toString(CryptoJS.enc.Utf8);

  return decryptedPrivateKey;
}

export async function isPresentCryptedPrivateKeyAtStorage() {
  let isPresent: Boolean = false;
  const cryptedPk = await walletStorage.get('AesPk');
  console.log('walletStorag',walletStorage)
  console.log('cryptedPk',cryptedPk)

    if (cryptedPk) {
      isPresent = true;
    }
  
  return isPresent;
}

export function clearPkFromStorage() {
  chrome.storage.sync.remove(['AesPk']);
}
