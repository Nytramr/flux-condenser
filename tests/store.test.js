import { Store, createStore, getStore } from '../src/store';

describe('Store', () => {
  describe('getStore', () => {
    it('should return the referenced Store', () => {
      const storeName = Symbol('store1');

      const store = createStore(storeName, {});

      const secondStore = getStore(storeName);

      expect(store).toBe(secondStore);
    });

    it('should return undefined when the referenced Store does not exist', () => {
      const storeName = Symbol('store1');

      const store = getStore(storeName);

      expect(store).toBeUndefined();
    });
  });

  describe('createStore', () => {
    it('should create a Store', () => {
      const storeName = Symbol('store1');

      const store = createStore(storeName, {});

      expect(store instanceof Store).toBe(true);
    });

    it('should return the Store already created', () => {
      const storeName = Symbol('store1');

      const store = createStore(storeName, {});

      const secondStore = createStore(storeName, {});

      expect(store).toBe(secondStore);
    });

    it('should initiate the state of the Store with the given parameter', () => {
      const storeName = Symbol('store1');

      const initialValue = 'initial value';
      const store = createStore(storeName, initialValue);

      expect(store._state).toEqual(initialValue);
    });
  });

  describe('Store:constructor', () => {
    it('should create a Store with the given parameters', () => {
      const initialValue = 'initialValue';
      const fakeDispatcher = 'dispatcher';

      const store = new Store(fakeDispatcher, initialValue);

      expect(store._state).toEqual(initialValue);
      expect(store._dispatcher).toEqual(fakeDispatcher);
    });
  });

  describe('Store:', () => {
    let actionListener;
    let store;

    const dispatcher = {
      dispatch: jest.fn(),
      addActionListener: jest.fn(),
    };

    beforeEach(() => {
      store = new Store(dispatcher, {});
      dispatcher.addActionListener = jest.fn((_, listener) => actionListener = listener);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('dispatch', () => {
      it('should call the internal dispatcher dispatch method', () => {
        const action = 'ACTION_NAME';
        const payload = { payload: 1 };
        store.dispatch(action, payload);
        expect(dispatcher.dispatch).toHaveBeenCalledWith(action, payload);
      });
    });

    describe('addReducer', () => {
      it('should call the internal dispatcher addActionListener method', () => {
        const action = 'ACTION_NAME';
        const reducer = () => { };
        store.addReducer(action, reducer);
        expect(dispatcher.addActionListener).toHaveBeenCalledWith(action, expect.any(Function));
      });

      it('should call the reducer when the Action is dispatched by the dispatcher', () => {
        const action = 'ACTION_NAME';
        const reducer = jest.fn().mockReturnValue({});
        const payload = { payload: 1 };
        store.addReducer(action, reducer);

        actionListener(payload)
        expect(reducer).toHaveBeenCalledWith(store._state, payload);
      });
    });

    describe('subscribe', () => {
      it('should add the given callback to the list of selector\'s listeners', () => {
        const selectedValue = 'value';
        const subscriber = jest.fn();
        const selector = jest.fn().mockReturnValue(selectedValue);
        store.subscribe(subscriber, selector);
        expect(store._subscribers.has(selector)).toBe(true);
        expect(store._subscribers.get(selector).cbs).toContain(subscriber);
        expect(store._subscribers.get(selector).lastValue).toBe(selectedValue);
      });

      it('should add the given callbacks to the list of selector\'s listeners', () => {
        const subscriber1 = jest.fn();
        const subscriber2 = jest.fn();

        const selectedValue = 'value';
        const selector = jest.fn().mockReturnValue(selectedValue);

        store.subscribe(subscriber1, selector);
        store.subscribe(subscriber2, selector);

        expect(selector).toHaveBeenCalledTimes(1);
        expect(store._subscribers.get(selector).cbs).toHaveLength(2);
        expect(store._subscribers.get(selector).cbs).toContain(subscriber1);
        expect(store._subscribers.get(selector).cbs).toContain(subscriber2);
        expect(subscriber1).toHaveBeenCalledWith(selectedValue);
        expect(subscriber2).toHaveBeenCalledWith(selectedValue);
      });

      it('should add the given callbacks to each list of selector\'s listeners', () => {
        const subscriber1 = jest.fn();
        const subscriber2 = jest.fn();

        const selectedValue1 = 'value1';
        const selector1 = jest.fn().mockReturnValue(selectedValue1);

        const selectedValue2 = 'value1';
        const selector2 = jest.fn().mockReturnValue(selectedValue2);

        store.subscribe(subscriber1, selector1);
        store.subscribe(subscriber2, selector2);

        expect(store._subscribers.get(selector1).cbs).toHaveLength(1);
        expect(store._subscribers.get(selector2).cbs).toHaveLength(1);
        expect(store._subscribers.get(selector2).cbs).toContain(subscriber2);
        expect(store._subscribers.get(selector2).cbs).not.toContain(subscriber1);
        expect(subscriber1).toHaveBeenCalledWith(selectedValue1);
        expect(subscriber2).toHaveBeenCalledWith(selectedValue2);
      });

      it('should call each subscriber with the result of the selector on the reduced state when the Action is dispatched by the dispatcher', () => {
        const action = 'ACTION_NAME';
        const payload = { payload: 1 };

        const newSate = { state: 'new' };
        const reducer = jest.fn();

        const subscriber1 = jest.fn();
        const subscriber2 = jest.fn();
        const subscriber3 = jest.fn();

        const selectedValue = 'value';
        const selector = jest.fn();

        store.addReducer(action, reducer);
        store.subscribe(subscriber1, selector);
        store.subscribe(subscriber2, selector);

        jest.resetAllMocks();

        reducer.mockReturnValue(newSate);
        selector.mockReturnValue(selectedValue);

        expect(store._subscribers.get(selector).lastValue).toBeUndefined();

        actionListener(payload);
        store.subscribe(subscriber3, selector);

        expect(selector).toHaveBeenCalledTimes(1);
        expect(selector).toHaveBeenCalledWith(newSate);
        expect(store._subscribers.get(selector).lastValue).toBe(selectedValue);

        expect(subscriber1).toHaveBeenCalledWith(selectedValue);
        expect(subscriber2).toHaveBeenCalledWith(selectedValue);
        expect(subscriber3).toHaveBeenCalledWith(selectedValue);
      });
    });
  });
});