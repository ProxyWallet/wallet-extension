import React from 'react';
import { Link } from 'react-chrome-extension-router';

import CreateWalletPage from '../CreateWalletPage/CreateWallet';
import Login from '../LoginPage/LoginPage';

const AuthenticationPage = (props: any) => {
  return (
    <div className="flex flex-col ">
      <Link component={Login}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Login
        </button>
      </Link>
      <Link component={CreateWalletPage}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create Wallet
        </button>
      </Link>
    </div>
  );
};

export default AuthenticationPage;
