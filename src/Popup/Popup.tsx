import './Popup.css';

import React, { useEffect, useState } from 'react';
import { Router,goTo} from 'react-chrome-extension-router';

import { Context } from './Context';
import AuthenticationPage from './pages/AuthenticationPage/AuthenticationPage';
import MainPage from './pages/MainPage/MainPage';

function Popup() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [accountAddress, setAccountAddress] = useState(false);

  useEffect(() => {
    if(loggedIn){
      goTo(MainPage)
    }
  })
  
  return (
    <>
      <Context.Provider
        value={{
          loggedIn,
          setLoggedIn,
          accountAddress,
          setAccountAddress,
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
