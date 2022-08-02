/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
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
} from "../common";

export interface TermReaderInterface extends utils.Interface {
  functions: {
    "globalTerm(string)": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "globalTerm"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "globalTerm",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "globalTerm", data: BytesLike): Result;

  events: {
    "GlobalTermAdded(bytes32,bytes32)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "GlobalTermAdded"): EventFragment;
}

export interface GlobalTermAddedEventObject {
  term: string;
  value: string;
}
export type GlobalTermAddedEvent = TypedEvent<
  [string, string],
  GlobalTermAddedEventObject
>;

export type GlobalTermAddedEventFilter = TypedEventFilter<GlobalTermAddedEvent>;

export interface TermReader extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TermReaderInterface;

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
    globalTerm(
      _key: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  globalTerm(
    _key: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    globalTerm(
      _key: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {
    "GlobalTermAdded(bytes32,bytes32)"(
      term?: PromiseOrValue<BytesLike> | null,
      value?: null
    ): GlobalTermAddedEventFilter;
    GlobalTermAdded(
      term?: PromiseOrValue<BytesLike> | null,
      value?: null
    ): GlobalTermAddedEventFilter;
  };

  estimateGas: {
    globalTerm(
      _key: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    globalTerm(
      _key: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}