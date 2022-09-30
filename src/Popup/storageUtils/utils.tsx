import { ethers } from 'ethers';
var CryptoJS = require('crypto-js');

export function createPasswordForMnemonic(
  mnemonicPhrase: string,
  password: any
) {
  const wallet = ethers.Wallet.fromMnemonic(mnemonicPhrase);
  const cryptedPrivateKey = CryptoJS.AES.encrypt(
    wallet.privateKey,
    password
  ).toString();

  chrome.storage.sync.set({ AesPk: cryptedPrivateKey }, function () {
    console.log('cryptedPrivateKey ' + cryptedPrivateKey);
  });
}

export async function decryptPrivatKeyViaPassword(password: any) {
  let cryptedPk = await chrome.storage.sync
    .get('AesPk')
    .then(function (result) {
      if (result.AesPk) {
        return result.AesPk;
      }
    });

  const decryptedPrivateKey = CryptoJS.AES.decrypt(
    cryptedPk,
    password
  ).toString(CryptoJS.enc.Utf8);

  return decryptedPrivateKey;
}

export function isPresentCryptedPrivateKeyAtStorage() {
  let isPresent: Boolean = false;
  chrome.storage.sync.get(['AesPk'], function (result) {
    if (result.AesPk) {
      isPresent = true;
    }
  });

  return isPresent;
}

export function clearPkFromStorage() {
  chrome.storage.sync.remove(['AesPk']);
}
