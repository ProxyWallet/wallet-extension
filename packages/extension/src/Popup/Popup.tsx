import './Popup.css';

import React, { useEffect, useState } from 'react';
import { Router, goTo } from 'react-chrome-extension-router';

import { Context } from './Context';
import AuthenticationPage from './pages/AuthenticationPage/AuthenticationPage';
import MainPage from './pages/MainPage/MainPage';
import { ethers, Wallet } from 'ethers';
import EnterPasswordPage from './pages/EnterPasswordPage/EnterPasswordPage';
import CreateWalletPage from './pages/CreateWalletPage/CreateWallet';

function Popup() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [accountPrivateKey, setAccountPrivateKey] = useState();
  const [signer, setSigner] = useState<Wallet>();

  useEffect(() => {
    chrome.storage.sync.get(['AesPk'], function (result) {
      setAccountPrivateKey(result.AesPk);
    });

    if (signer) {
      goTo(MainPage);
    } else if (!accountPrivateKey) {
      goTo(CreateWalletPage);
    } else {
      goTo(EnterPasswordPage);
    }
  }, [accountPrivateKey, loggedIn, signer]);

  return (
    <>
      <Context.Provider
        value={{
          loggedIn,
          setLoggedIn,
          signer,
          setSigner,
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
