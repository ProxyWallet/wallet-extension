/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface WalletInterface extends ethers.utils.Interface {
  functions: {
    "addBlacklistedFunction((address,bytes4))": FunctionFragment;
    "addBlacklistedFunctionMult(tuple[])": FunctionFragment;
    "depositNFT(address,address,uint256)": FunctionFragment;
    "executeFunction(address,bytes,uint256)": FunctionFragment;
    "executeFunctionHash()": FunctionFragment;
    "expireBlock()": FunctionFragment;
    "getFuncStoreHash((address,bytes4))": FunctionFragment;
    "isBlacklisted((address,bytes4))": FunctionFragment;
    "isPostExecuteSetted()": FunctionFragment;
    "nftContract()": FunctionFragment;
    "nftId()": FunctionFragment;
    "owner()": FunctionFragment;
    "postExpiredExecute(bytes,address)": FunctionFragment;
    "postExpiredExecuteAction()": FunctionFragment;
    "postExpiredExecuteTo()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "renter()": FunctionFragment;
    "setPostExpiredFunction(bytes,address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addBlacklistedFunction",
    values: [{ addr: string; funcSelector: BytesLike }]
  ): string;
  encodeFunctionData(
    functionFragment: "addBlacklistedFunctionMult",
    values: [{ addr: string; funcSelector: BytesLike }[]]
  ): string;
  encodeFunctionData(
    functionFragment: "depositNFT",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "executeFunction",
    values: [string, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "executeFunctionHash",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "expireBlock",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getFuncStoreHash",
    values: [{ addr: string; funcSelector: BytesLike }]
  ): string;
  encodeFunctionData(
    functionFragment: "isBlacklisted",
    values: [{ addr: string; funcSelector: BytesLike }]
  ): string;
  encodeFunctionData(
    functionFragment: "isPostExecuteSetted",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "nftContract",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "nftId", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "postExpiredExecute",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "postExpiredExecuteAction",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "postExpiredExecuteTo",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "renter", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setPostExpiredFunction",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "addBlacklistedFunction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addBlacklistedFunctionMult",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "depositNFT", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "executeFunction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeFunctionHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "expireBlock",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFuncStoreHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isBlacklisted",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isPostExecuteSetted",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "nftContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "nftId", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "postExpiredExecute",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "postExpiredExecuteAction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "postExpiredExecuteTo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "renter", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setPostExpiredFunction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "BlacklistFunction(address,bytes4)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "BlacklistFunction"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export type BlacklistFunctionEvent = TypedEvent<
  [string, string] & { _blacklistedTo: string; _functionSelector: string }
>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string] & { previousOwner: string; newOwner: string }
>;

export class Wallet extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: WalletInterface;

  functions: {
    addBlacklistedFunction(
      identifier: { addr: string; funcSelector: BytesLike },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    addBlacklistedFunctionMult(
      identifiers: { addr: string; funcSelector: BytesLike }[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    depositNFT(
      _nftContract: string,
      _owner: string,
      _nftId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    executeFunction(
      _executeTo: string,
      _executeCalldata: BytesLike,
      _executeValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    executeFunctionHash(overrides?: CallOverrides): Promise<[string]>;

    expireBlock(overrides?: CallOverrides): Promise<[BigNumber]>;

    getFuncStoreHash(
      identifier: { addr: string; funcSelector: BytesLike },
      overrides?: CallOverrides
    ): Promise<[string]>;

    isBlacklisted(
      identifier: { addr: string; funcSelector: BytesLike },
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isPostExecuteSetted(overrides?: CallOverrides): Promise<[boolean]>;

    nftContract(overrides?: CallOverrides): Promise<[string]>;

    nftId(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    postExpiredExecute(
      _executeCalldata: BytesLike,
      _executeTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    postExpiredExecuteAction(overrides?: CallOverrides): Promise<[string]>;

    postExpiredExecuteTo(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renter(overrides?: CallOverrides): Promise<[string]>;

    setPostExpiredFunction(
      postExpiredAction: BytesLike,
      postExpiredTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  addBlacklistedFunction(
    identifier: { addr: string; funcSelector: BytesLike },
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  addBlacklistedFunctionMult(
    identifiers: { addr: string; funcSelector: BytesLike }[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  depositNFT(
    _nftContract: string,
    _owner: string,
    _nftId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  executeFunction(
    _executeTo: string,
    _executeCalldata: BytesLike,
    _executeValue: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  executeFunctionHash(overrides?: CallOverrides): Promise<string>;

  expireBlock(overrides?: CallOverrides): Promise<BigNumber>;

  getFuncStoreHash(
    identifier: { addr: string; funcSelector: BytesLike },
    overrides?: CallOverrides
  ): Promise<string>;

  isBlacklisted(
    identifier: { addr: string; funcSelector: BytesLike },
    overrides?: CallOverrides
  ): Promise<boolean>;

  isPostExecuteSetted(overrides?: CallOverrides): Promise<boolean>;

  nftContract(overrides?: CallOverrides): Promise<string>;

  nftId(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  postExpiredExecute(
    _executeCalldata: BytesLike,
    _executeTo: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  postExpiredExecuteAction(overrides?: CallOverrides): Promise<string>;

  postExpiredExecuteTo(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renter(overrides?: CallOverrides): Promise<string>;

  setPostExpiredFunction(
    postExpiredAction: BytesLike,
    postExpiredTo: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addBlacklistedFunction(
      identifier: { addr: string; funcSelector: BytesLike },
      overrides?: CallOverrides
    ): Promise<void>;

    addBlacklistedFunctionMult(
      identifiers: { addr: string; funcSelector: BytesLike }[],
      overrides?: CallOverrides
    ): Promise<void>;

    depositNFT(
      _nftContract: string,
      _owner: string,
      _nftId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    executeFunction(
      _executeTo: string,
      _executeCalldata: BytesLike,
      _executeValue: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    executeFunctionHash(overrides?: CallOverrides): Promise<string>;

    expireBlock(overrides?: CallOverrides): Promise<BigNumber>;

    getFuncStoreHash(
      identifier: { addr: string; funcSelector: BytesLike },
      overrides?: CallOverrides
    ): Promise<string>;

    isBlacklisted(
      identifier: { addr: string; funcSelector: BytesLike },
      overrides?: CallOverrides
    ): Promise<boolean>;

    isPostExecuteSetted(overrides?: CallOverrides): Promise<boolean>;

    nftContract(overrides?: CallOverrides): Promise<string>;

    nftId(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    postExpiredExecute(
      _executeCalldata: BytesLike,
      _executeTo: string,
      overrides?: CallOverrides
    ): Promise<string>;

    postExpiredExecuteAction(overrides?: CallOverrides): Promise<string>;

    postExpiredExecuteTo(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    renter(overrides?: CallOverrides): Promise<string>;

    setPostExpiredFunction(
      postExpiredAction: BytesLike,
      postExpiredTo: string,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "BlacklistFunction(address,bytes4)"(
      _blacklistedTo?: null,
      _functionSelector?: null
    ): TypedEventFilter<
      [string, string],
      { _blacklistedTo: string; _functionSelector: string }
    >;

    BlacklistFunction(
      _blacklistedTo?: null,
      _functionSelector?: null
    ): TypedEventFilter<
      [string, string],
      { _blacklistedTo: string; _functionSelector: string }
    >;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;
  };

  estimateGas: {
    addBlacklistedFunction(
      identifier: { addr: string; funcSelector: BytesLike },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    addBlacklistedFunctionMult(
      identifiers: { addr: string; funcSelector: BytesLike }[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    depositNFT(
      _nftContract: string,
      _owner: string,
      _nftId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    executeFunction(
      _executeTo: string,
      _executeCalldata: BytesLike,
      _executeValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    executeFunctionHash(overrides?: CallOverrides): Promise<BigNumber>;

    expireBlock(overrides?: CallOverrides): Promise<BigNumber>;

    getFuncStoreHash(
      identifier: { addr: string; funcSelector: BytesLike },
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isBlacklisted(
      identifier: { addr: string; funcSelector: BytesLike },
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isPostExecuteSetted(overrides?: CallOverrides): Promise<BigNumber>;

    nftContract(overrides?: CallOverrides): Promise<BigNumber>;

    nftId(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    postExpiredExecute(
      _executeCalldata: BytesLike,
      _executeTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    postExpiredExecuteAction(overrides?: CallOverrides): Promise<BigNumber>;

    postExpiredExecuteTo(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renter(overrides?: CallOverrides): Promise<BigNumber>;

    setPostExpiredFunction(
      postExpiredAction: BytesLike,
      postExpiredTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addBlacklistedFunction(
      identifier: { addr: string; funcSelector: BytesLike },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    addBlacklistedFunctionMult(
      identifiers: { addr: string; funcSelector: BytesLike }[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    depositNFT(
      _nftContract: string,
      _owner: string,
      _nftId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    executeFunction(
      _executeTo: string,
      _executeCalldata: BytesLike,
      _executeValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    executeFunctionHash(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    expireBlock(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getFuncStoreHash(
      identifier: { addr: string; funcSelector: BytesLike },
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isBlacklisted(
      identifier: { addr: string; funcSelector: BytesLike },
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isPostExecuteSetted(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    nftContract(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    nftId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    postExpiredExecute(
      _executeCalldata: BytesLike,
      _executeTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    postExpiredExecuteAction(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    postExpiredExecuteTo(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setPostExpiredFunction(
      postExpiredAction: BytesLike,
      postExpiredTo: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
