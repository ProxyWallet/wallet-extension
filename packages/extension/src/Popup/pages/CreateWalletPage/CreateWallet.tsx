import { ethers } from 'ethers';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateWalletPage = () => {
  const [createdWallet, setCreatedWalled] = useState<any>();
  const navigate = useNavigate();

  function createWallet() {
    const wallet = ethers.Wallet.createRandom();

    setCreatedWalled(wallet);
  }

  return (
    <div>
      <button
        className="button"
        onClick={() => createWallet()}
      >
        Generate wallet
      </button>

      {createdWallet ? (
        <div>
          <h1>{createdWallet.mnemonic.phrase}</h1>
        </div>
      ) : (
        ''
      )}
      <button
        className="button"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      {createdWallet ? (
        <button
          className="button"
          onClick={() => navigate('/login-page')}
        >
          Next
        </button>
      ) : (
        ''
      )}
    </div>
  );
};

export default CreateWalletPage;
