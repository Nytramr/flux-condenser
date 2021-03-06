import { dispatcher as globalDispatcher } from './dispatcher';

const stores = {};

export class BaseStore {
  constructor(initialState = {}) {
    this._state = initialState;
    this._subscribers = new Map();
    this._condenserUnsubscribers = [];
  }

  /**
   * This method will subscribe the store to the given dispatcher.
   * 
   * @param {Dispatcher} dispatcher The Dispatcher instance to subscribe the action-condenser
   * @param {String} action Action name
   * @param {Function} condenser This is a callback function, it will receive the state and the action payload, it must return a new state or undefined if no changes in the state are necessary.
   * @returns the unsubscribe condenser function.
   */
  addCondenser(dispatcher, action, condenser) {
    const unsubscriber = dispatcher.addActionListener(action, (payload) => {
      this._state = condenser(this._state, payload);

      this._subscribers.forEach((subscribers, extractor) => {
        const value = extractor(this._state);
        if (subscribers.lastValue !== value) {
          subscribers.lastValue = value;
          subscribers.cbs.forEach(subscriber => subscriber(value));
        }
      });
    });

    this._condenserUnsubscribers.push(unsubscriber);

    return () => {
      this._condenserUnsubscribers = this._condenserUnsubscribers.filter(us => us !== unsubscriber);
      unsubscriber();
    };
  }

  /**
   * This method will unsubscribe the store's condensers from the dispatcher
   */
  destroyStore() {
    this._condenserUnsubscribers.forEach(unsubscriber => unsubscriber());
  }

  /**
   * 
   * @param {Function} dataHandler This function is executed with the new data extracted via the extractor
   * @param {Function} extractor This function is to extract a portion of data from the state of the store
   */
  subscribe(dataHandler, extractor) {
    if (!this._subscribers.has(extractor)) {
      this._subscribers.set(extractor, {
        cbs:[],
        lastValue: extractor(this._state),
      });
    }
    const subscriber = this._subscribers.get(extractor);
    subscriber.cbs.push(dataHandler);
    dataHandler(subscriber.lastValue);

    return () => {
      this.unSubscribe(dataHandler, extractor);
    };
  }

  unSubscribe(dataHandler, extractor) {
    const subscriber = this._subscribers.get(extractor);
    subscriber.cbs = subscriber.cbs.filter(callback => callback !== dataHandler);
  }

  /**
   * execExtractor will execute a extractor against the store data and return whatever it returns.
   * 
   * It is the developer responsibility not to mess up with the data
   * 
   * @param {Function} extractor a function to return a piece of the stored data
   */
  execExtractor(extractor) {
    return extractor(this._state);
  }
}
export class Store extends BaseStore {
  constructor(dispatcher, initialState = {}) {
    super(initialState);
    this._dispatcher = dispatcher;
  }

  /**
   * This method will dispatch a given action on the dispatcher with which this store was built.
   * 
   * @param {Action} action The action to be dispatched 
   */
  dispatch({action, payload}) {
    this._dispatcher.dispatch({action, payload});
  }

  /**
   * This method will subscribe the store to the dispatcher dispatched.
   * 
   * @param {String} action Action name
   * @param {Function} condenser This is a callback function, it will receive the state and the action payload, it must return a new state or undefined if no changes in the state are necessary.
   * @returns the unsubscribe function.
   */
  addCondenser(action, condenser) {
    return super.addCondenser(this._dispatcher, action, condenser);
  }
}

export function createStore(symbol, initialData, condensers = []) {
  if (typeof symbol !== 'symbol') {
    console.warn('Fancy error message to encourage people to use symbols as store names');
  }

  const instance = stores[symbol] || (stores[symbol] = new Store(globalDispatcher, initialData));
  condensers.forEach(([action, condenser]) => instance.addCondenser(action, condenser));
  return instance;
}

export function getStore(symbol) {
  return stores[symbol];
}
