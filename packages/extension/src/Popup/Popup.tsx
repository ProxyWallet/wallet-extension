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

function Popup() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [accountPrivateKey, setAccountPrivateKey] = useState<any>();
  const [signer, setSigner] = useState<Wallet>();
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      const aesPk = await isPresentCryptedPrivateKeyAtStorage();
      console.log('aeaesPkaesPksPk',aesPk)
      setAccountPrivateKey(aesPk);
    };

    getUsers();

    if (signer) {
      navigate('/main');
    } else if (accountPrivateKey) {
      console.log('qweqweqwe')

      navigate('./enter-password');   
    } else {
      console.log('dasdasds')
      navigate('./');
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
          <Routes>
            <Route path="/" element={<AuthenticationPage />}></Route>
            <Route path="/main" element={<MainPage />}></Route>
            <Route path="/create-wallet" element={<CreateWalletPage />}></Route>
            <Route path="/enter-password" element={<EnterPasswordPage />}></Route>
            <Route path="/login-page" element={<LoginPage />}></Route>
          </Routes>
        </div>
      </Context.Provider>
    </>
  );
}

export default Popup;
