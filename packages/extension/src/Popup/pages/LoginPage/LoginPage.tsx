import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Context } from '../../Context';
import { createPasswordForMnemonic } from '../../storageUtils/utils';

const LoginPage = (props: any) => {
  const [mnemonicPhrase, setMnemonicPhrase] = useState<any>();
  const [password, setPassword] = useState<any>();
  const navigate = useNavigate();

  const { loggedIn, setLoggedIn } = useContext<any>(Context);

  async function createPasswordAndLogin() {
    if (!mnemonicPhrase || !password) alert('missing argument');
    await createPasswordForMnemonic(mnemonicPhrase, password);
    setLoggedIn(!loggedIn);
  }

  return (
    <div className="flex flex-col w-2/5">
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
          onClick={() => navigate('/create-wallet')}
        >
          Create new
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
