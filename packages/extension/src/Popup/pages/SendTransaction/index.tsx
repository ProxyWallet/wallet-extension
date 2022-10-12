import React, { useContext, useState, useEffect } from 'react';
import Browser from 'webextension-polyfill';
import { getCustomError, getError } from '../../../lib/errors';
import { newPopupOnMessage, sendRuntimeMessageToBackground } from '../../../lib/message-bridge/bridge';
import { RuntimePostMessagePayload, RuntimePostMessagePayloadType } from '../../../lib/message-bridge/types';
import { InternalBgMethods } from '../../../lib/message-handlers/background-message-handler';
import { GetAccountsDTO } from '../../../lib/providers/background/methods/internal/getUserAddresses';
import { ErrorCodes, EthereumRequest } from '../../../lib/providers/types';
import { Context } from '../../Context';
import { Marketplace__factory } from '../../testContractFactory/Marketplace__factory';
import { TransactionRequest } from '@ethersproject/abstract-provider'

type PromiseResult = TransactionRequest;

type PromiseResultResolve = (res: PromiseResult) => void;
type PromiseResultReject = (reason?: any) => void;

const SendTransactionPage = (props: any) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [txToSign, setTxToSign] = useState<TransactionRequest>();

  const [reqPromise] = useState(
    () => {
      const funcs = {} as {
        reject: PromiseResultReject | undefined;
        resolve: PromiseResultResolve | undefined;
      }

      return {
        funcs,
        promise: new Promise<PromiseResult>((_resolve, _reject) => {
          funcs.resolve = _resolve;
          funcs.reject = _reject;
        })
      }
    });

  const discardConnect = () => {
    alert('discard')
    reqPromise.funcs?.reject?.(getError(ErrorCodes.userRejected));
  }

  const acceptConnect = () => {
    alert('accept')
    if (txToSign) reqPromise.funcs.resolve?.(txToSign);
  }

  const onTabMessage = async (req: RuntimePostMessagePayload<EthereumRequest<TransactionRequest>>) => {
    if (!req.msg || !req.msg.params || !req.msg.params.length) {
      const err = getCustomError('Invalid payload')
      reqPromise.funcs?.reject?.(err);
      throw err;
    }

    const [tx] = req.msg.params;

    setTxToSign(tx);
    setIsLoaded(true);
    return reqPromise.promise;
  }

  useEffect(() => {
    newPopupOnMessage<PromiseResult, EthereumRequest<TransactionRequest>>(onTabMessage)

    // getCurrentWindowActiveTabIndex().then(tabId => {
    //   Browser.tabs.onRemoved.addListener(function tabListener(_tabId) {
    //     if (_tabId === tabId) {
    //       Browser.tabs.onRemoved.removeListener(tabListener);
    //       Browser.runtime.onMessage.removeListener(onTabMessage);
    //     }
    //   })
    // })

    return () => {
      // discardConnect()
      Browser.runtime.onMessage.removeListener(onTabMessage);
    }
  }, [])

  return (
    <div>
      <div className="flex flex-col w-2/5" style={{ width: '100%' }}>
        <h1>Transaction</h1>

        <p>Data: {txToSign?.data}</p>
        <p>To: {txToSign?.to}</p>
        <p>Value: {txToSign?.value}</p>

        <div style={{
          display: 'flex',
          flexDirection: 'row'
        }}>
          <button className="font-bold py-2 px-4 rounded">
            Discard
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Approve
          </button>

        </div>

      </div>
    </div>
  );
};

export default SendTransactionPage;
