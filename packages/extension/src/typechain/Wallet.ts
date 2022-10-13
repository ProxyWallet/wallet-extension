/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface WalletInterface extends utils.Interface {
  functions: {
    "ApproveForConfigure(address)": FunctionFragment;
    "autoExecuteTo(address,bytes)": FunctionFragment;
    "blacklistedAction(address,bytes)": FunctionFragment;
    "blacklistedActionAutoExecute(address,bytes)": FunctionFragment;
    "blacklistedFunctions(address,uint256)": FunctionFragment;
    "isApprovedToSetBlacklist(address)": FunctionFragment;
    "makeTransaction(address,bytes)": FunctionFragment;
    "owner()": FunctionFragment;
    "setBlacklistedActions(address,bytes,uint256,address,bytes)": FunctionFragment;
    "setBlacklistedContractFunction(address,bytes,uint256,address,bytes)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "ApproveForConfigure"
      | "autoExecuteTo"
      | "blacklistedAction"
      | "blacklistedActionAutoExecute"
      | "blacklistedFunctions"
      | "isApprovedToSetBlacklist"
      | "makeTransaction"
      | "owner"
      | "setBlacklistedActions"
      | "setBlacklistedContractFunction"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "ApproveForConfigure",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "autoExecuteTo",
    values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "blacklistedAction",
    values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "blacklistedActionAutoExecute",
    values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "blacklistedFunctions",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedToSetBlacklist",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "makeTransaction",
    values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setBlacklistedActions",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setBlacklistedContractFunction",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "ApproveForConfigure",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "autoExecuteTo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "blacklistedAction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "blacklistedActionAutoExecute",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "blacklistedFunctions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedToSetBlacklist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "makeTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setBlacklistedActions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setBlacklistedContractFunction",
    data: BytesLike
  ): Result;

  events: {
    "ApproveForConfiguration(address)": EventFragment;
    "blacklistedActionsSetted(address,bytes,uint256,address,bytes)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ApproveForConfiguration"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "blacklistedActionsSetted"): EventFragment;
}

export interface ApproveForConfigurationEventObject {
  approvedTo: string;
}
export type ApproveForConfigurationEvent = TypedEvent<
  [string],
  ApproveForConfigurationEventObject
>;

export type ApproveForConfigurationEventFilter =
  TypedEventFilter<ApproveForConfigurationEvent>;

export interface blacklistedActionsSettedEventObject {
  _blacklistedTo: string;
  blacklistActionBytes: string;
  _expiryBlock: BigNumber;
  _autoExecuteTo: string;
  autoExecuteActionBytes: string;
}
export type blacklistedActionsSettedEvent = TypedEvent<
  [string, string, BigNumber, string, string],
  blacklistedActionsSettedEventObject
>;

export type blacklistedActionsSettedEventFilter =
  TypedEventFilter<blacklistedActionsSettedEvent>;

export interface Wallet extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: WalletInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    ApproveForConfigure(
      _approveAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    autoExecuteTo(
      _autoExecuteTo: PromiseOrValue<string>,
      _autoExecuteActionBytes: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    blacklistedAction(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<
      [string, string, boolean] & {
        blacklistedTo: string;
        blacklistActionBytes: string;
        isBlacklisted: boolean;
      }
    >;

    blacklistedActionAutoExecute(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string, string] & {
        expiryBlock: BigNumber;
        autoExecuteTo: string;
        autoExecuteActionBytes: string;
      }
    >;

    blacklistedFunctions(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, string, boolean] & {
        blacklistedTo: string;
        blacklistFunctionsBytes: string;
        isBlacklisted: boolean;
      }
    >;

    isApprovedToSetBlacklist(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    makeTransaction(
      _to: PromiseOrValue<string>,
      callBytes: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    setBlacklistedActions(
      _blacklistedTo: PromiseOrValue<string>,
      _blacklistActionBytes: PromiseOrValue<BytesLike>,
      _expiryBlock: PromiseOrValue<BigNumberish>,
      _autoExecuteTo: PromiseOrValue<string>,
      _autoExecuteActionBytes: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setBlacklistedContractFunction(
      _blacklistedTo: PromiseOrValue<string>,
      _blacklistFunctionBytes: PromiseOrValue<BytesLike>,
      _expiryBlock: PromiseOrValue<BigNumberish>,
      _autoExecuteTo: PromiseOrValue<string>,
      _autoExecuteActionBytes: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  ApproveForConfigure(
    _approveAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  autoExecuteTo(
    _autoExecuteTo: PromiseOrValue<string>,
    _autoExecuteActionBytes: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  blacklistedAction(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<
    [string, string, boolean] & {
      blacklistedTo: string;
      blacklistActionBytes: string;
      isBlacklisted: boolean;
    }
  >;

  blacklistedActionAutoExecute(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, string, string] & {
      expiryBlock: BigNumber;
      autoExecuteTo: string;
      autoExecuteActionBytes: string;
    }
  >;

  blacklistedFunctions(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [string, string, boolean] & {
      blacklistedTo: string;
      blacklistFunctionsBytes: string;
      isBlacklisted: boolean;
    }
  >;

  isApprovedToSetBlacklist(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  makeTransaction(
    _to: PromiseOrValue<string>,
    callBytes: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  setBlacklistedActions(
    _blacklistedTo: PromiseOrValue<string>,
    _blacklistActionBytes: PromiseOrValue<BytesLike>,
    _expiryBlock: PromiseOrValue<BigNumberish>,
    _autoExecuteTo: PromiseOrValue<string>,
    _autoExecuteActionBytes: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setBlacklistedContractFunction(
    _blacklistedTo: PromiseOrValue<string>,
    _blacklistFunctionBytes: PromiseOrValue<BytesLike>,
    _expiryBlock: PromiseOrValue<BigNumberish>,
    _autoExecuteTo: PromiseOrValue<string>,
    _autoExecuteActionBytes: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    ApproveForConfigure(
      _approveAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    autoExecuteTo(
      _autoExecuteTo: PromiseOrValue<string>,
      _autoExecuteActionBytes: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    blacklistedAction(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<
      [string, string, boolean] & {
        blacklistedTo: string;
        blacklistActionBytes: string;
        isBlacklisted: boolean;
      }
    >;

    blacklistedActionAutoExecute(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string, string] & {
        expiryBlock: BigNumber;
        autoExecuteTo: string;
        autoExecuteActionBytes: string;
      }
    >;

    blacklistedFunctions(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, string, boolean] & {
        blacklistedTo: string;
        blacklistFunctionsBytes: string;
        isBlacklisted: boolean;
      }
    >;

    isApprovedToSetBlacklist(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    makeTransaction(
      _to: PromiseOrValue<string>,
      callBytes: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    setBlacklistedActions(
      _blacklistedTo: PromiseOrValue<string>,
      _blacklistActionBytes: PromiseOrValue<BytesLike>,
      _expiryBlock: PromiseOrValue<BigNumberish>,
      _autoExecuteTo: PromiseOrValue<string>,
      _autoExecuteActionBytes: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    setBlacklistedContractFunction(
      _blacklistedTo: PromiseOrValue<string>,
      _blacklistFunctionBytes: PromiseOrValue<BytesLike>,
      _expiryBlock: PromiseOrValue<BigNumberish>,
      _autoExecuteTo: PromiseOrValue<string>,
      _autoExecuteActionBytes: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ApproveForConfiguration(address)"(
      approvedTo?: null
    ): ApproveForConfigurationEventFilter;
    ApproveForConfiguration(
      approvedTo?: null
    ): ApproveForConfigurationEventFilter;

    "blacklistedActionsSetted(address,bytes,uint256,address,bytes)"(
      _blacklistedTo?: null,
      blacklistActionBytes?: null,
      _expiryBlock?: null,
      _autoExecuteTo?: null,
      autoExecuteActionBytes?: null
    ): blacklistedActionsSettedEventFilter;
    blacklistedActionsSetted(
      _blacklistedTo?: null,
      blacklistActionBytes?: null,
      _expiryBlock?: null,
      _autoExecuteTo?: null,
      autoExecuteActionBytes?: null
    ): blacklistedActionsSettedEventFilter;
  };

  estimateGas: {
    ApproveForConfigure(
      _approveAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    autoExecuteTo(
      _autoExecuteTo: PromiseOrValue<string>,
      _autoExecuteActionBytes: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    blacklistedAction(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    blacklistedActionAutoExecute(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    blacklistedFunctions(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isApprovedToSetBlacklist(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    makeTransaction(
      _to: PromiseOrValue<string>,
      callBytes: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    setBlacklistedActions(
      _blacklistedTo: PromiseOrValue<string>,
      _blacklistActionBytes: PromiseOrValue<BytesLike>,
      _expiryBlock: PromiseOrValue<BigNumberish>,
      _autoExecuteTo: PromiseOrValue<string>,
      _autoExecuteActionBytes: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setBlacklistedContractFunction(
      _blacklistedTo: PromiseOrValue<string>,
      _blacklistFunctionBytes: PromiseOrValue<BytesLike>,
      _expiryBlock: PromiseOrValue<BigNumberish>,
      _autoExecuteTo: PromiseOrValue<string>,
      _autoExecuteActionBytes: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    ApproveForConfigure(
      _approveAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    autoExecuteTo(
      _autoExecuteTo: PromiseOrValue<string>,
      _autoExecuteActionBytes: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    blacklistedAction(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    blacklistedActionAutoExecute(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    blacklistedFunctions(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isApprovedToSetBlacklist(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    makeTransaction(
      _to: PromiseOrValue<string>,
      callBytes: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setBlacklistedActions(
      _blacklistedTo: PromiseOrValue<string>,
      _blacklistActionBytes: PromiseOrValue<BytesLike>,
      _expiryBlock: PromiseOrValue<BigNumberish>,
      _autoExecuteTo: PromiseOrValue<string>,
      _autoExecuteActionBytes: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setBlacklistedContractFunction(
      _blacklistedTo: PromiseOrValue<string>,
      _blacklistFunctionBytes: PromiseOrValue<BytesLike>,
      _expiryBlock: PromiseOrValue<BigNumberish>,
      _autoExecuteTo: PromiseOrValue<string>,
      _autoExecuteActionBytes: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
