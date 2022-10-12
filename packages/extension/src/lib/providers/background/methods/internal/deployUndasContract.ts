import { ContractFactory, ethers } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { TestGameContract__factory } from '../../../../../Popup/testContractFactory/TestGameContract__factory';
import { Wallet__factory } from '../../../../../Popup/testContractFactory/Wallet__factory';
import { getCustomError } from '../../../../errors';
import { BackgroundOnMessageCallback } from '../../../../message-bridge/bridge';
import Storage, { StorageNamespaces } from '../../../../storage';
import { getBaseUrl } from '../../../../utils/url';
import { EthereumRequest } from '../../../types';
import { UserAccountDTO } from './initializeWallet';

export const deployUndasContract: any = async () => {
  const alchemyProvider = new ethers.providers.AlchemyProvider( //move to .env
    'goerli',
    'oddBTGV5Pb8AW_EWk7CJSSDxTwjfUlE9'
  );
  const storageWallets = new Storage(StorageNamespaces.USER_WALLETS);

  const selectedAccount = await storageWallets.get<UserAccountDTO>(
    'selectedAccount'
  );
  const accounts: any = await storageWallets.get('accounts');
  if (!selectedAccount) return;

  const privateKey: any = selectedAccount.privateKey;

  const signer = new ethers.Wallet(privateKey, alchemyProvider);

  const TestGameFactory = new ContractFactory(
    TestGameContract__factory.abi,
    TestGameContract__factory.bytecode
  );
  console.log(
    'balanceOf...',
    ethers.utils.formatEther(await signer.getBalance())
  );

  const contract = await TestGameFactory.connect(signer).deploy(signer.address);

  console.log('loading...');

  await contract.deployed();

  selectedAccount.undasContract = contract.address;

  accounts.map((address: any) => {
    console.log('qwe',address)
    if (address.address == selectedAccount.address) {
      address.undasContract = contract.address;
    }
  });

};
