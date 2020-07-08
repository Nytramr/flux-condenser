import { dispatcher as globalDispatcher } from './dispatcher';

const stores = {};

export class Store {
  constructor(dispatcher, initialState = {}) {
    this._state = initialState;
    this._subscribers = new Map();
    this._dispatcher = dispatcher;
  }

  dispatch(action, payload) {
    this._dispatcher.dispatch(action, payload);
  }

  /**
   * This method will subscribe the store to the dispatcher dispatched.
   * @param {Action} action Action name
   * @param {Function} reducer This is a callback function, it will receive the state and the action payload, it must return a new state or undefined if no changes in the state are necessary.
   * @returns the unsubscribe function.
   */
  addReducer(action, reducer) {
    return this._dispatcher.addActionListener(action, (payload) => {
      this._state = reducer(this._state, payload);

      this._subscribers.forEach((subscribers, selector) => {
        const value = selector(this._state);
        if (subscribers.lastValue !== value) {
          subscribers.lastValue = value;
          subscribers.cbs.forEach(subscriber => subscriber(value));
        }
      });
    });
  }

  /**
   * 
   * @param {Function} getData This function is executed with the new data extracted via the selector
   * @param {Element} selector This function is to extract a portion of data from the state of the store
   */
  subscribe(getData, selector) {
    if (!this._subscribers.has(selector)) {
      this._subscribers.set(selector, {
        cbs:[],
        lastValue: selector(this._state),
      });
    }
    const subscriber = this._subscribers.get(selector);
    subscriber.cbs.push(getData);
    getData(subscriber.lastValue);

    return () => {
      this.unSubscribe(getData, selector);
    };
  }

  unSubscribe(getData, selector) {
    const subscriber = this._subscribers.get(selector);
    subscriber.cbs = subscriber.cbs.filter(callback => callback !== getData);
  }

  /**
   * execSelector will execute a selector against the store data and return whatever it returns.
   * 
   * It is the developer responsibility not to mess up with the data
   * 
   * @param {function} selector a function to return a piece of the stored data
   */
  execSelector(selector) {
    return selector(this._state);
  }
}

export function createStore(symbol, initialData) {
  if (typeof symbol !== 'symbol') {
    console.warn('Fancy error message to encourage people to use symbols as store names');
  }

  const instance = stores[symbol] || (stores[symbol] = new Store(globalDispatcher, initialData));
  return instance;
}

export function getStore(symbol) {
  return stores[symbol];
}
