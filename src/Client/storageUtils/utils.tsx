import { ethers } from 'ethers';
import { storageGet, storageSet } from '../../Lib/storage';

var CryptoJS = require('crypto-js');

export async function createPasswordForMnemonic(
  mnemonicPhrase: string,
  password: any
) {
  const wallet = ethers.Wallet.fromMnemonic(mnemonicPhrase);
  const cryptedPrivateKey = CryptoJS.AES.encrypt(
    wallet.privateKey,
    password
  ).toString();
  await storageSet('AesPk', cryptedPrivateKey, 'walletUndas');
}

export async function decryptPrivatKeyViaPassword(password: any) {
  const cryptedPk = await storageGet('AesPk', 'walletUndas');

  if (!cryptedPk) return console.log('!AesPk');

  const decryptedPrivateKey = CryptoJS.AES.decrypt(
    cryptedPk,
    password
  ).toString(CryptoJS.enc.Utf8);

  return decryptedPrivateKey;
}

export async function isPresentCryptedPrivateKeyAtStorage() {
  let isPresent: Boolean = false;
  const cryptedPk = await storageGet('AesPk', 'walletUndas');

    if (cryptedPk) {
      isPresent = true;
    }
  
  return isPresent;
}

export function clearPkFromStorage() {
  chrome.storage.sync.remove(['AesPk']);
}
