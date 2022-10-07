import './Popup.css';

import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Context } from './Context';
import AuthenticationPage from './pages/AuthenticationPage/AuthenticationPage';
import MainPage from './pages/MainPage/MainPage';
import { Wallet } from 'ethers';
import EnterPasswordPage from './pages/EnterPasswordPage/EnterPasswordPage';
import CreateWalletPage from './pages/CreateWalletPage/CreateWallet';
import { isPresentCryptedPrivateKeyAtStorage } from './storageUtils/utils';
import LoginPage from './pages/LoginPage/LoginPage';
import { ConnectDapp } from './pages/ConnectDapp';
import { Loading } from './pages/Loading';
import { UIRoutes } from '../lib/popup-routes';

function Popup() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [accountPrivateKey, setAccountPrivateKey] = useState<any>();
  const [signer, setSigner] = useState<Wallet>();
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      const aesPk = await isPresentCryptedPrivateKeyAtStorage();
      setAccountPrivateKey(aesPk);
    };

    getUsers();

    // if (signer) {
    //   // navigate('/main');
    // } else if (accountPrivateKey) {
    //   navigate('./enter-password');
    // } else {
    //   navigate('./');
    // }
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
          <Routes>
            <Route path="/" element={<AuthenticationPage />}></Route>
            <Route path={'/' + UIRoutes.loading.path} element={<Loading />}></Route>
            <Route path="/main" element={<MainPage />}></Route>
            <Route path={'/' + UIRoutes.ethConnectDApp.path} element={<ConnectDapp />}></Route>
            <Route path="/create-wallet" element={<CreateWalletPage />}></Route>
            <Route
              path="/enter-password"
              element={<EnterPasswordPage />}
            ></Route>
            <Route path="/login-page" element={<LoginPage />}></Route>
          </Routes>
        </div>
      </Context.Provider>
    </>
  );
}

export default Popup;
