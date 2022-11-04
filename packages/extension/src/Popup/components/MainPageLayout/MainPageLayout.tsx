import React from 'react';
import { GetAccountsDTO } from '../../../lib/providers/background/methods/internal/getUserAddresses';

import './MainPageLayout.css';

type MainPageLayoutProps = {
  userAccounts?: GetAccountsDTO[];
  onCreateNewWalletClick: () => void;
  onAddExistingWalletClick: () => void;
  isUndasContract?: boolean;
  importedContract?: string;
  setImportedContract: (val1: string) => void;
  importUndasContract: (val1: string) => void;
  switchAccount: (val1: GetAccountsDTO, val2: boolean) => void;
  onAccountSwitchConnected: (val1: string, val2: boolean) => void;
  deployContract: () => void;
  logOut: () => void;
  interactWithContract: () => void;
};

const MainPageLayout = ({
  userAccounts,
  onCreateNewWalletClick,
  onAddExistingWalletClick,
  isUndasContract,
  setImportedContract,
  importUndasContract,
  importedContract,
  switchAccount,
  onAccountSwitchConnected,
  deployContract,
  logOut,
  interactWithContract,
}: MainPageLayoutProps) => {
    
  return (
    <div>
      <div className="main">
        {userAccounts && (
          <>
            <h1>Accounts:</h1>
            <button onClick={onCreateNewWalletClick}>Create new</button>
            <button onClick={onAddExistingWalletClick}>Add existing</button>
            {!isUndasContract ? (
              <div className="import-contract">
                <input
                  className="import-contract__input"
                  onChange={(e) => {
                    return setImportedContract(e.target.value);
                  }}
                />
                <button
                  className="import-contract__input"
                  onClick={() =>
                    importUndasContract(importedContract as string)
                  }
                >
                  Import Contract
                </button>
              </div>
            ) : (
              ''
            )}
            {userAccounts.map((account: GetAccountsDTO) => {
              return (
                <div key={account.address}>
                  <div className="address">
                    <div
                      className="address-active"
                      onClick={() => {
                        if (
                          !account.isActive ||
                          account.undasContract?.isActive
                        )
                          switchAccount(account, false);
                      }}
                    >
                      {account.isActive && !account.undasContract?.isActive && (
                        <span>&#10004;</span>
                      )}
                      <span>{account.address}</span>
                      <div
                        className={
                          account.isConnected
                            ? 'account-address account-address_success'
                            : 'account-address account-address_error'
                        }
                        onClick={() =>
                          onAccountSwitchConnected(account.address, false)
                        }
                      />
                    </div>
                    {account.undasContract ? (
                      <>
                        <div
                          className="address-undascontract"
                          onClick={() => {
                            if (!account.undasContract?.isActive)
                              switchAccount(account, true);
                          }}
                        >
                          <span>&#129302;</span>
                          {account.isActive &&
                            account.undasContract.isActive && (
                              <span>&#10004;</span>
                            )}
                          <span>{account.undasContract.address}</span>
                          <div
                            className={
                              account.undasContract.isConnected
                                ? 'account-address account-address_success'
                                : 'account-address account-address_error'
                            }
                            onClick={() =>
                              onAccountSwitchConnected(
                                account.undasContract?.address ?? '',
                                true
                              )
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {account.isActive && (
                          <button onClick={deployContract}>
                            Deploy undas proxy contract
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
        <p className="check">Main page</p>
        <select name="network">
          <option value="mainnet">Mainnet</option>
          <option value="bsc">Binance smart chain</option>
          <option value="moonbeam">Moonbeam</option>
        </select>
        <p>Balance: 0.02</p>
        <button className="button">Send</button>
        <button className="button">Buy</button>
        <button className="button" onClick={() => logOut()}>
          Log out
        </button>
        <button className="button" onClick={() => interactWithContract()}>
          Test contract interaction
        </button>
      </div>
    </div>
  );
};

export default MainPageLayout;
