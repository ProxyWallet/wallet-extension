
import React, { useContext, useState } from 'react';

import { Context } from '../../Context';
import { clearPkFromStorage } from '../../storageUtils/utils';
import { Marketplace__factory } from '../../testContractFactory/Marketplace__factory';

const MainPage = (props: any) => {
  const { loggedIn, setLoggedIn, signer,setSigner } = useContext<any>(Context);

  async function interactWithContract() {
    const CONTRACT_ADDRESS = '0xA24a7E2beed00E65C6B44006C7cfd6c7E8409c6A';
    const NFTContract = Marketplace__factory.connect(CONTRACT_ADDRESS, signer);
    const tx = await NFTContract._listingsLastIndex();
    alert(tx);
  }

  function logOut() {
    setSigner(undefined)
    setLoggedIn(!loggedIn);
  }

  return (
    <div>
      <div className="flex flex-col w-2/5">
        {signer ? (
          <h2>
            {signer.address.slice(0, 4)} ... {signer.address.slice(38, 42)}
          </h2>
        ) : (
          ''
        )}
        <p>Main page</p>
        <select name="network">
          <option value="mainnet">Mainnet</option>
          <option value="bsc">Binance smart chain</option>
          <option value="moonbeam">Moonbeam</option>
        </select>
        <p>Balance: 0.02</p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Send
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Buy
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => logOut()}
        >
          Log out
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => interactWithContract()}
        >
          Test contract interaction
        </button>
      </div>
    </div>
  );
};

export default MainPage;
