import { Action } from "./actions";
import { Dispatcher } from "./dispatcher";

export function createStore<DATA, ACTIONS>(
  symbol: symbol,
  initialData: DATA,
  condensers?: Array<[ACTIONS, (initialState: DATA, payload: Action<ACTIONS>['payload']) => DATA]>
): Store<DATA, ACTIONS>;

export function getStore<T, A>(symbol: symbol): BaseStore<T, A>;

export class BaseStore<DATA, ACTIONS> {
  constructor(initialState?: DATA);
  /**
   * This method will subscribe the store to the given dispatcher.
   *
   * @param {Dispatcher} dispatcher The Dispatcher instance to subscribe the action-condenser
   * @param {String} action Action name
   * @param {Function} condenser This is a callback function, it will receive the state and the action payload, it must return a new state or undefined if no changes in the state are necessary.
   * @returns the unsubscribe condenser function.
   */
  addCondenser(
    dispatcher: Dispatcher<ACTIONS>,
    action: ACTIONS,
    condenser: (initialState: DATA, payload: any) => DATA
  ): () => void;
  /**
   * This method will unsubscribe the store's condensers from the dispatcher
   */
  destroyStore(): void;
  /**
   *
   * @param {Function} dataHandler This function is executed with the new data extracted via the extractor
   * @param {Function} extractor This function is to extract a portion of data from the state of the store
   */
  subscribe<T>(dataHandler: (data: T) => any, extractor: (state: DATA) => T): () => void;
  unSubscribe<T>(dataHandler: (data: T) => any, extractor: (state: DATA) => T): void;
  /**
   * execExtractor will execute a extractor against the store data and return whatever it returns.
   *
   * It is the developer responsibility not to mess up with the data
   *
   * @param {Function} extractor a function to return a piece of the stored data
   */
  execExtractor(extractor: (state: DATA) => any): any;
}

export class Store<DATA, ACTIONS> extends BaseStore<DATA, ACTIONS> {
  constructor(dispatcher: Dispatcher<ACTIONS>, initialState?: DATA);
  /**
   * This method will dispatch a given action on the dispatcher with which this store was built.
   *
   * @param {Action} action The action to be dispatched
   */
  dispatch({ action, payload }: Action<ACTIONS>): void;
}
