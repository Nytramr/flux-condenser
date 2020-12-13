import { Action, Dispatcher } from "./dispatcher";

export function createStore<T, A>(
  symbol: symbol,
  initialData: T,
  condensers?: Array<[A, (initialState: T, payload: any) => T]>
): Store<T, A>;

export function getStore<T, A>(symbol: symbol): BaseStore<T, A>;

export class BaseStore<T, A> {
  constructor(initialState?: T);
  /**
   * This method will subscribe the store to the given dispatcher.
   *
   * @param {Dispatcher} dispatcher The Dispatcher instance to subscribe the action-condenser
   * @param {String} action Action name
   * @param {Function} condenser This is a callback function, it will receive the state and the action payload, it must return a new state or undefined if no changes in the state are necessary.
   * @returns the unsubscribe condenser function.
   */
  addCondenser(
    dispatcher: Dispatcher<A>,
    action: A,
    condenser: (initialState: T, payload: any) => T
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
  subscribe(dataHandler: Function, extractor: (state: T) => any): () => void;
  unSubscribe(dataHandler: Function, extractor: (state: T) => any): void;
  /**
   * execExtractor will execute a extractor against the store data and return whatever it returns.
   *
   * It is the developer responsibility not to mess up with the data
   *
   * @param {Function} extractor a function to return a piece of the stored data
   */
  execExtractor(extractor: (state: T) => any): any;
}

export class Store<T, A> extends BaseStore<T, A> {
  constructor(dispatcher: Dispatcher<A>, initialState?: T);
  /**
   * This method will dispatch a given action on the dispatcher with which this store was built.
   *
   * @param {Action} action The action to be dispatched
   */
  dispatch({ action, payload }: Action<A>): void;
}
