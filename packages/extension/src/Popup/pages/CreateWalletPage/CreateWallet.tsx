import { ethers } from 'ethers';
import React, { useState } from 'react';
import { goBack, goTo } from 'react-chrome-extension-router';
import LoginPage from '../LoginPage/LoginPage';

const CreateWalletPage = (props: any) => {
  const [createdWallet, setCreatedWalled] = useState<any>();

  function createWallet() {
    const wallet = ethers.Wallet.createRandom();

    setCreatedWalled(wallet);
    sessionStorage.setItem('address', wallet.address);
  }
  console.log(createdWallet);
  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => createWallet()}
      >
        Generate wallet
      </button>

      {createdWallet ? (
        <div>
          <h1>{createdWallet.address}</h1>
          <h1>{createdWallet.mnemonic.phrase}</h1>
          <h1>{createdWallet.privateKey}</h1>
        </div>
      ) : (
        ''
      )}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => goBack()}
      >
        Back
      </button>
      {createdWallet ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => goTo(LoginPage)}
        >
          LogIN
        </button>
      ) : (
        ''
      )}
    </div>
  );
};

export default CreateWalletPage;
