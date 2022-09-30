import React, { useContext, useEffect, useState } from 'react';
import { goBack, goTo } from 'react-chrome-extension-router';

import { Context } from '../../Context';
import {
  createPasswordForMnemonic,
  isPresentCryptedPrivateKeyAtStorage,
} from '../../storageUtils/utils';
import CreateWalletPage from '../CreateWalletPage/CreateWallet';

const LoginPage = (props: any) => {
  const [mnemonicPhrase, setMnemonicPhrase] = useState<any>();
  const [password, setPassword] = useState<any>();
  const [isCryptedPk, setIsCryptedPk] = useState<Boolean>();

  const { loggedIn, setLoggedIn } = useContext<any>(Context);

  function createPasswordAndLogin() {
    if (!mnemonicPhrase || !password) alert('missing argument');
    createPasswordForMnemonic(mnemonicPhrase, password);
    setLoggedIn(!loggedIn);
  }

  function isAesPkPresent() {
    const isCryptedPk = isPresentCryptedPrivateKeyAtStorage();
    setIsCryptedPk(isCryptedPk);
  }

  useEffect(() => {
    isAesPkPresent();
  });

  return (
    <div className="flex flex-col w-2/5">
      {!isCryptedPk ? (
        <div>
          <h2>Login with mnemonic</h2>
          <input
            type="text"
            placeholder="Mnemonic"
            className="bg-blue-500"
            onChange={(e) => setMnemonicPhrase(e.target.value)}
          />
          <input
            type="text"
            placeholder="Create Password"
            className="bg-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => createPasswordAndLogin()}
          >
            Login
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => goTo(CreateWalletPage)}
          >
            Create new
          </button>
        </div>
      ) : (
        <div>
          <h2>Enter your password</h2>
          <input
            type="text"
            placeholder="Create Password"
            className="bg-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            // onClick={() => reLogin(password)}
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
