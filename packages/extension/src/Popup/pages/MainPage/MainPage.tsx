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
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { DeployedContractResult } from '../../../lib/providers/background/methods/internal/deployUndasContract';
import { SwitchAccountsRequestPayloadDTO } from '../../../lib/providers/background/methods/internal/switchAccount';
import { getAddress } from 'ethers/lib/utils';
import { importContract } from '../../../lib/providers/background/methods/internal/importContract';
import { getUndasContractAddress } from '../../../lib/providers/background/methods/internal/getUndasContractAddress';

import MainPageLayout from '../../components/MainPageLayout/MainPageLayout';

const MainPage = () => {
  const { loggedIn, setLoggedIn, signer, setSigner } = useContext<any>(Context);
  const [userAccounts, setUserAccounts] = useState<GetAccountsDTO[]>();
  const [importedContract, setImportedContract] = useState<string>();
  const [isUndasContract, setIsUndasContract] = useState<boolean>();

  async function isUndasContractPresent() {
    const contractAddr = await getUndasContractAddress();
    console.log('eqweqweqweqeqw', contractAddr);
    if (contractAddr) {
      setIsUndasContract(true);
    } else {
      setIsUndasContract(false);
    }
  }

  async function importUndasContract(contractAddress: any) {
    importContract(contractAddress);
    if (userAccounts) {
      setUserAccounts(
        userAccounts.map((acc) => {
          if (acc.isActive) {
            acc.undasContract = {
              address: contractAddress,
              isActive: false,
              isConnected: false,
            };
          }
          return acc;
        })
      );
    }
  }

  async function interactWithContract() {
    const CONTRACT_ADDRESS = '0xA24a7E2beed00E65C6B44006C7cfd6c7E8409c6A';
    const NFTContract = Marketplace__factory.connect(CONTRACT_ADDRESS, signer);
    const tx = await NFTContract._listingsLastIndex();
    alert(tx);
  }

  const getUserAccounts = async () => {
    const [currentTab] = await Browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    console.log('currentTab', currentTab);

    // TODO: extract background internal queries to functions
    const res = await sendRuntimeMessageToBackground<
      EthereumRequest,
      GetAccountsDTO[]
    >(
      {
        method: InternalBgMethods.GET_USER_ADDRESSES, //eth_sendTx
        params: [currentTab.url],
      },
      RuntimePostMessagePayloadType.INTERNAL
    );

    console.log('getUserAccounts:', res);
    if (res.error || !res.result) alert('get user error');
    setUserAccounts(res.result);
  };

  const deployContract = async () => {
    const deployTx = await sendRuntimeMessageToBackground<
      EthereumRequest,
      TransactionRequest
    >(
      {
        method: InternalBgMethods.GET_UNDAS_CONTRACT_DEPLOY_TX,
        params: [
          /* should pass some constructor arguments here */
        ],
      },
      RuntimePostMessagePayloadType.INTERNAL
    );

    alert(JSON.stringify(deployTx));

    if (deployTx.error || !deployTx.result) return;

    const res = await sendRuntimeMessageToBackground<
      EthereumRequest<TransactionRequest>,
      DeployedContractResult
    >(
      {
        method: InternalBgMethods.DEPLOY_UNDAS_CONTRACT,
        params: [deployTx.result],
      },
      RuntimePostMessagePayloadType.INTERNAL
    );

    console.log('deploy res', res);

    if (res.error) {
      alert(`Contract deployment erorr. ${JSON.stringify(res.error)}`);
      return;
    } else if (res.result) {
      const address = res.result.address;
      alert(`Contract deployed on ${address}`);
      if (userAccounts)
        setUserAccounts(
          userAccounts.map((acc) => {
            if (acc.isActive) {
              acc.undasContract = {
                address,
                isActive: false,
                isConnected: false,
              };
            }
            return acc;
          })
        );
    }
  };

  const switchAccount = async (
    switchTo: GetAccountsDTO,
    switchToContract: boolean
  ) => {
    const res = await sendRuntimeMessageToBackground<
      EthereumRequest<SwitchAccountsRequestPayloadDTO>,
      string
    >(
      {
        method: InternalBgMethods.SWITCH_ACCOUNT,
        params: [
          {
            switchTo: switchTo.address,
            toContract: switchToContract,
          },
        ],
      },
      RuntimePostMessagePayloadType.INTERNAL
    );

    if (res.error) alert(`Switch error. Error: ${JSON.stringify(res.error)}`);

    if (userAccounts)
      setUserAccounts(
        userAccounts.map((acc) => {
          if (acc.isActive) {
            acc.isActive = false;
            acc.undasContract = acc.undasContract
              ? {
                  ...acc.undasContract,
                  isActive: false,
                }
              : undefined;
          }

          if (getAddress(acc.address) === getAddress(switchTo.address)) {
            acc.isActive = true;
            acc.undasContract = acc.undasContract
              ? {
                  ...acc.undasContract,
                  isActive: switchToContract,
                }
              : undefined;
          }

          return acc;
        })
      );
  };

  const _accountSwitchConnected = async (address: string) => {
    if (userAccounts)
      setUserAccounts(
        userAccounts.map((acc) => {
          if (getAddress(acc.address) === getAddress(address)) {
            acc.isConnected = !acc.isConnected;
          } else if (
            acc.undasContract &&
            getAddress(acc.undasContract.address) === getAddress(address)
          ) {
            acc.undasContract.isConnected = !acc.undasContract.isConnected;
          }

          return acc;
        })
      );
  };

  const _disconnectAccount = async (address: string) => {
    const res = await sendRuntimeMessageToBackground<
      EthereumRequest<string>,
      string
    >(
      {
        method: InternalBgMethods.DISCONNECT_ACCOUNT,
        params: [address],
      },
      RuntimePostMessagePayloadType.INTERNAL
    );
    if (res.error)
      alert(`Disconnect failed. Error: ${JSON.stringify(res.error)}`);
    _accountSwitchConnected(address);
  };

  const _connectAccount = async (address: string) => {
    const res = await sendRuntimeMessageToBackground<
      EthereumRequest<string>,
      string
    >(
      {
        method: InternalBgMethods.CONNECT_ACCOUNT,
        params: [address],
      },
      RuntimePostMessagePayloadType.INTERNAL
    );
    if (res.error) alert(`Connect failed. Error: ${JSON.stringify(res.error)}`);
    _accountSwitchConnected(address);
  };

  const onAccountSwitchConnected = async (
    address: string,
    isContract: boolean
  ) => {
    const acc = userAccounts?.find((acc) => {
      if (isContract && acc.undasContract)
        return getAddress(acc.undasContract.address) === getAddress(address);
      else return getAddress(acc.address) === getAddress(address);
    });
    if (!acc) {
      alert('Popup error. Account not found');
      return;
    }

    const _isConnected = isContract
      ? acc.undasContract?.isConnected ?? false
      : acc.isConnected;

    if (_isConnected) {
      return _disconnectAccount(address);
    } else return _connectAccount(address);
  };

  const onAddExistingWalletClick = async () => {};
  const onCreateNewWalletClick = async () => {};

  useEffect(() => {
    getUserAccounts();
    isUndasContractPresent();
  }, []);

  function logOut() {
    setSigner(undefined);
    setLoggedIn(!loggedIn);
  }

  return (
    <MainPageLayout
      userAccounts={userAccounts}
      onCreateNewWalletClick={onCreateNewWalletClick}
      onAddExistingWalletClick={onAddExistingWalletClick}
      isUndasContract={isUndasContract}
      setImportedContract={setImportedContract}
      importUndasContract={importUndasContract}
      importedContract={importedContract}
      switchAccount={switchAccount}
      onAccountSwitchConnected={onAccountSwitchConnected}
      deployContract={deployContract}
      logOut={logOut}
      interactWithContract={interactWithContract}
    />
  );
};

export default MainPage;
