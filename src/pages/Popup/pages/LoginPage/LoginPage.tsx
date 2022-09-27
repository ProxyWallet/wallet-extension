import { ethers } from 'ethers';
import React, { useContext, useState } from 'react';
import { goBack } from 'react-chrome-extension-router';

import { Context } from '../../Context';

const LoginPage = (props: any) => {
  const [mnemonicPhrase, setMnemonicPhrase] = useState<any>();

  const { loggedIn, setLoggedIn } = useContext<any>(Context);

  function createWallet() {
    const wallet = ethers.Wallet.fromMnemonic(mnemonicPhrase);
    console.log(wallet);
    sessionStorage.setItem('address', wallet.address);
    setLoggedIn(true);
  }

  return (
    <div className="flex flex-col w-2/5">
      <h2>Login with mnemonic</h2>
      <input
        type="text"
        placeholder="Mnemonic"
        className="bg-blue-500"
        onChange={(e) => setMnemonicPhrase(e.target.value)}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => createWallet()}
      >
        Login
      </button>
      {!loggedIn ? <div>Not logedIn</div> : 'logedIn'}

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => goBack()}
      >back</button>
    </div>
  );
};

export default LoginPage;
