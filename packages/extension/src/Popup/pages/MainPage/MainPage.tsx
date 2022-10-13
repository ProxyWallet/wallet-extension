import { ContractFactory, ethers } from 'ethers';
import React, { useContext, useState, useEffect } from 'react';
import Browser from 'webextension-polyfill';
import { sendRuntimeMessageToBackground } from '../../../lib/message-bridge/bridge';
import { RuntimePostMessagePayloadType } from '../../../lib/message-bridge/types';
import { InternalBgMethods } from '../../../lib/message-handlers/background-message-handler';
import { GetAccountsDTO } from '../../../lib/providers/background/methods/internal/getUserAddresses';
import { EthereumRequest } from '../../../lib/providers/types';
import { Context } from '../../Context';
import { Marketplace__factory } from '../../testContractFactory/Marketplace__factory';
import { Wallet } from '../../testContractFactory/Wallet';
import { Wallet__factory } from '../../testContractFactory/Wallet__factory';
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { DeployedContractResult } from '../../../lib/providers/background/methods/internal/deployUndasContract';
import { SwitchAccountsRequestPayloadDTO } from '../../../lib/providers/background/methods/internal/switchAccount';
import { getAddress } from 'ethers/lib/utils';

const MainPage = (props: any) => {
  const { loggedIn, setLoggedIn, signer, setSigner } = useContext<any>(Context);
  const [userAccounts, setUserAccounts] = useState<GetAccountsDTO[]>();

  async function interactWithContract() {
    const CONTRACT_ADDRESS = '0xA24a7E2beed00E65C6B44006C7cfd6c7E8409c6A';
    const NFTContract = Marketplace__factory.connect(CONTRACT_ADDRESS, signer);
    const tx = await NFTContract._listingsLastIndex();
    alert(tx);
  }

  const getUserAccounts = async () => {
    const [currentTab] = await Browser.tabs.query({ active: true, currentWindow: true });
    console.log('currentTab', currentTab);

    // TODO: extract background internal queries to functions
    const res = await sendRuntimeMessageToBackground<EthereumRequest, GetAccountsDTO[]>({
      method: InternalBgMethods.GET_USER_ADDRESSES,//eth_sendTx
      params: [currentTab.url]
    }, RuntimePostMessagePayloadType.INTERNAL)

    console.log('getUserAccounts:', res)
    if (res.error || !res.result) alert('get user error');
    setUserAccounts(res.result);
  }

  const deployContract = async () => {
    const deployTx = await sendRuntimeMessageToBackground<EthereumRequest, TransactionRequest>({
      method: InternalBgMethods.GET_UNDAS_CONTRACT_DEPLOY_TX,
      params: [/* should pass some constructor arguments here */]
    }, RuntimePostMessagePayloadType.INTERNAL)

    alert(JSON.stringify(deployTx))

    if (deployTx.error || !deployTx.result) return;

    const res = await sendRuntimeMessageToBackground<EthereumRequest<TransactionRequest>, DeployedContractResult>({
      method: InternalBgMethods.DEPLOY_UNDAS_CONTRACT,
      params: [deployTx.result]
    }, RuntimePostMessagePayloadType.INTERNAL)

    console.log('deploy res', res);

    if (res.error) {
      alert(`Contract deployment erorr. ${JSON.stringify(res.error)}`)
      return;
    } else if (res.result) {
      const address = res.result.address;
      alert(`Contract deployed on ${address}`)
      if (userAccounts)
        setUserAccounts(userAccounts.map(acc => {
          if (acc.isActive) {
            acc.undasContract = {
              address,
              isActive: false
            }
          }
          return acc;
        }))
    }
  }

  const switchAccount = async (switchTo: GetAccountsDTO, switchToContract: boolean) => {
    const res = await sendRuntimeMessageToBackground<EthereumRequest<SwitchAccountsRequestPayloadDTO>, string>({
      method: InternalBgMethods.SWITCH_ACCOUNT,
      params: [{
        switchTo: switchTo.address,
        toContract: switchToContract
      }]
    }, RuntimePostMessagePayloadType.INTERNAL)

    if (res.error) alert(`Switch error. Error: ${JSON.stringify(res.error)}`)

    if (userAccounts)
        setUserAccounts(userAccounts.map(acc => {
          if (acc.isActive) {
            acc.isActive = false;
            acc.undasContract = acc.undasContract ? {
              ...acc.undasContract,
              isActive: false
            } : undefined
          }

          if (
            getAddress(acc.address) === getAddress(switchTo.address)
          ) {
            acc.isActive = true;
            acc.undasContract = acc.undasContract ? {
              ...acc.undasContract,
              isActive: switchToContract
            } : undefined
          }

          return acc;
        }))
  }

  const onAddExistingWalletClick = async () => { }
  const onCreateNewWalletClick = async () => { }

  useEffect(() => {
    getUserAccounts();
  }, [])


  function logOut() {
    setSigner(undefined);
    setLoggedIn(!loggedIn);
  }

  return (
    <div>
      <div className="flex flex-col w-2/5" style={{ width: '100%' }}>
        {userAccounts &&
          <>
            <h1>Accounts:</h1>
            <button onClick={onCreateNewWalletClick}>Create new</button>
            <button onClick={onAddExistingWalletClick}>Add existing</button>
            {userAccounts.map(account => (
              <div
                key={account.address}
                style={{
                  width: '100%',
                }}>
                <div style={{
                  width: '100%',
                  minHeight: '30px',
                  border: '1px solid black',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}>

                  <div style={{
                    width: '100%',
                    height: '30px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                  }}
                    onClick={() => {
                      if (!account.isActive || account.undasContract?.isActive)
                        switchAccount(account, false)
                    }}
                  >
                    {(account.isActive && !account.undasContract?.isActive) && <span>&#10004;</span>}
                    <span>{account.address}</span>
                    <div style={{
                      width: '10px', height: '10px',
                      backgroundColor: account.isConnected ? 'green' : 'red'
                    }}>
                    </div>
                  </div>
                  {account.undasContract ?
                    <>
                      <div style={{
                        width: '100%',
                        height: '30px',
                        marginLeft: '25px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center'
                      }}
                        onClick={() => {
                          if (!account.undasContract?.isActive)
                            switchAccount(account, true)
                        }}
                      >
                        <span>&#129302;</span>
                        {(account.isActive && account.undasContract.isActive) && <span>&#10004;</span>}
                        <span>{account.undasContract.address}</span>
                        <div style={{
                          width: '10px', height: '10px',
                          backgroundColor: account.isConnected ? 'green' : 'red'
                        }}>
                        </div>
                      </div>
                    </> :
                    <>
                      {
                        account.isActive &&
                        <button onClick={deployContract}>Deploy undas proxy contract</button>
                      }
                    </>
                  }
                </div>

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
