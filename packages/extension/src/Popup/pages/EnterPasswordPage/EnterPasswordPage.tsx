import { ethers } from 'ethers';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../Context';
import { decryptPrivatKeyViaPassword } from '../../storageUtils/utils';

import './EnterPasswordPage.css';

const EnterPasswordPage = (props: any) => {
  const { loggedIn, setLoggedIn, signer, setSigner } = useContext<any>(Context);
  const [password, setPassword] = useState<string>();
  const navigate = useNavigate();

  function createSigner(accountPrivateKey: any) {
    const alchemyProvider = new ethers.providers.AlchemyProvider( //move to .env
      'goerli',
      'oddBTGV5Pb8AW_EWk7CJSSDxTwjfUlE9'
    );
    const newSigner = new ethers.Wallet(accountPrivateKey, alchemyProvider);
    setSigner(newSigner);
  }

  async function decrypt() {
    const pk = await decryptPrivatKeyViaPassword(password);
    createSigner(pk);
    setLoggedIn(!loggedIn);
  }

  return (
    <div className="password">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="enter password page"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="button" onClick={() => decrypt()}>
        LogIn
      </button>
      <button className="button" onClick={() => navigate('/create-wallet')}>
        Create new
      </button>
    </div>
  );
};

export default EnterPasswordPage;
