import './Popup.css';

import React, { useEffect, useState } from 'react';
import { Router, goTo } from 'react-chrome-extension-router';

import { Context } from './Context';
import AuthenticationPage from './pages/AuthenticationPage/AuthenticationPage';
import MainPage from './pages/MainPage/MainPage';
import { ethers, Wallet } from 'ethers';

function Popup() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [accountPrivateKey, setAccountPrivateKey] = useState();
  const [signer, setSigner] = useState<Wallet>();

  function createSigner(accountPrivateKey: any) {
    const alchemyProvider = new ethers.providers.AlchemyProvider( //move to .env
      'goerli',
      'oddBTGV5Pb8AW_EWk7CJSSDxTwjfUlE9'
    );
    setSigner(new ethers.Wallet(accountPrivateKey, alchemyProvider));
  }

  useEffect(() => {
    chrome.storage.sync.get(['pk'], function (result) {
      setAccountPrivateKey(result.pk);
    });
    if (accountPrivateKey) {
      createSigner(accountPrivateKey);
      goTo(MainPage);
    } else {
      goTo(AuthenticationPage);
    }
  }, [accountPrivateKey, loggedIn]);

  return (
    <>
      <Context.Provider
        value={{
          loggedIn,
          setLoggedIn,
          signer,
        }}
      >
        <div>
          <Router>
            <AuthenticationPage />
          </Router>
        </div>
      </Context.Provider>
    </>
  );
}

export default Popup;
