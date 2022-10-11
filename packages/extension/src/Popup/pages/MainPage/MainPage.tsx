import React, { useContext, useState, useEffect } from 'react';
import { sendRuntimeMessageToBackground } from '../../../lib/message-bridge/bridge';
import { RuntimePostMessagePayloadType } from '../../../lib/message-bridge/types';
import { InternalBgMethods } from '../../../lib/message-handlers/background-message-handler';
import { EthereumRequest } from '../../../lib/providers/types';
import { Context } from '../../Context';
import { Marketplace__factory } from '../../testContractFactory/Marketplace__factory';

const MainPage = (props: any) => {
  const { loggedIn, setLoggedIn, signer, setSigner } = useContext<any>(Context);
  const [userAccounts, setUserAccounts] = useState<string[]>();

  async function interactWithContract() {
    const CONTRACT_ADDRESS = '0xA24a7E2beed00E65C6B44006C7cfd6c7E8409c6A';
    const NFTContract = Marketplace__factory.connect(CONTRACT_ADDRESS, signer);
    const tx = await NFTContract._listingsLastIndex();
    alert(tx);
  }

  const getUserAccounts = async () => {
    const res = await sendRuntimeMessageToBackground<EthereumRequest, string[]>({
      method: InternalBgMethods.GET_USER_ADDRESSES,
    }, RuntimePostMessagePayloadType.INTERNAL)
    console.log('getUserAccounts:', res)
    if (res.error || !res.result) alert('get user error');
    setUserAccounts(res.result);
  }

  useEffect(() => {
    getUserAccounts();
  }, [])


  function logOut() {
    setSigner(undefined);
    setLoggedIn(!loggedIn);
  }

  return (
    <div>
      <div className="flex flex-col w-2/5" style={{width: '100%'}}>
        {userAccounts &&
          <>
            {userAccounts.map(account => (
              <div style={{
                width: '100%',
                height: '30px',
                border: '1px solid black'
              }}>
                {account}
              </div>
            ))}
          </>
        }
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
