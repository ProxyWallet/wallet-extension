import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../../index.css';

const AuthenticationPage = (props: any) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col ">
      <button
        className="button"
        onClick={() => navigate('./login-page')}
      >
        Login
      </button>
      <button
        className="button"
        onClick={() => navigate('./create-wallet')}
      >
        Create Wallet
      </button>
    </div>
  );
};

export default AuthenticationPage;
