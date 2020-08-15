import { dispatcher } from '../src/dispatcher';
import { Store, createStore, getStore } from '../src/store';

jest.mock('../src/dispatcher');

describe('Store', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getStore', () => {
    it('should return the referenced Store', () => {
      const storeName = Symbol('store1');

      const store = createStore(storeName, {});

      const secondStore = getStore(storeName);

      expect(store).toBe(secondStore);
    });

    it('should return undefined when the referenced Store does not exist', () => {
      const storeName = Symbol('store2');

      const store = getStore(storeName);

      expect(store).toBeUndefined();
    });
  });

  describe('createStore', () => {
    it('should create a Store', () => {
      const storeName = Symbol('store3');

      const store = createStore(storeName, {});

      expect(store instanceof Store).toBe(true);
    });

    it('should return the Store already created', () => {
      const storeName = Symbol('store4');

      const store = createStore(storeName, {});

      const secondStore = createStore(storeName, {});

      expect(store).toBe(secondStore);
    });

    it('should initiate the state of the Store with the given parameter', () => {
      const storeName = Symbol('store5');

      const initialValue = 'initial value';
      const store = createStore(storeName, initialValue);

      expect(store._state).toEqual(initialValue);
    });

    it('should initiate the state of the Store with the given data processors', () => {
      const storeName = Symbol('store6');
      const initialValue = 'initial value';

      const condensers = [
        ['Action1', jest.fn()],
        ['Action1', jest.fn()],
        ['Action2', jest.fn()],
      ];

      const store = createStore(storeName, initialValue, condensers);

      expect(store._condenserUnsubscribers).toHaveLength(3);
      expect(dispatcher.addActionListener).toHaveBeenCalledTimes(3);
      expect(dispatcher.addActionListener).toHaveBeenNthCalledWith(1, 'Action1', expect.any(Function));
      expect(dispatcher.addActionListener).toHaveBeenNthCalledWith(2, 'Action1', expect.any(Function));
      expect(dispatcher.addActionListener).toHaveBeenNthCalledWith(3, 'Action2', expect.any(Function));
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

    describe('addCondenser', () => {
      it('should call the internal dispatcher addActionListener method', () => {
        const action = 'ACTION_NAME';
        const condenser = () => { };
        store.addCondenser(action, condenser);
        expect(dispatcher.addActionListener).toHaveBeenCalledWith(action, expect.any(Function));
      });

      it('should call the condenser when the Action is dispatched by the dispatcher', () => {
        const action = 'ACTION_NAME';
        const condenser = jest.fn().mockReturnValue({});
        const payload = { payload: 1 };
        store.addCondenser(action, condenser);

        actionListener(payload)
        expect(condenser).toHaveBeenCalledWith(store._state, payload);
      });
    });

    describe('subscribe', () => {
      it('should add the given callback to the list of extractor\'s listeners', () => {
        const selectedValue = 'value';
        const subscriber = jest.fn();
        const extractor = jest.fn().mockReturnValue(selectedValue);
        store.subscribe(subscriber, extractor);
        expect(store._subscribers.has(extractor)).toBe(true);
        expect(store._subscribers.get(extractor).cbs).toContain(subscriber);
        expect(store._subscribers.get(extractor).lastValue).toBe(selectedValue);
      });

      it('should add the given callbacks to the list of extractor\'s listeners', () => {
        const subscriber1 = jest.fn();
        const subscriber2 = jest.fn();

        const selectedValue = 'value';
        const extractor = jest.fn().mockReturnValue(selectedValue);

        store.subscribe(subscriber1, extractor);
        store.subscribe(subscriber2, extractor);

        expect(extractor).toHaveBeenCalledTimes(1);
        expect(store._subscribers.get(extractor).cbs).toHaveLength(2);
        expect(store._subscribers.get(extractor).cbs).toContain(subscriber1);
        expect(store._subscribers.get(extractor).cbs).toContain(subscriber2);
        expect(subscriber1).toHaveBeenCalledWith(selectedValue);
        expect(subscriber2).toHaveBeenCalledWith(selectedValue);
      });

      it('should add the given callbacks to each list of extractor\'s listeners', () => {
        const subscriber1 = jest.fn();
        const subscriber2 = jest.fn();

        const selectedValue1 = 'value1';
        const extractor1 = jest.fn().mockReturnValue(selectedValue1);

        const selectedValue2 = 'value1';
        const extractor2 = jest.fn().mockReturnValue(selectedValue2);

        store.subscribe(subscriber1, extractor1);
        store.subscribe(subscriber2, extractor2);

        expect(store._subscribers.get(extractor1).cbs).toHaveLength(1);
        expect(store._subscribers.get(extractor2).cbs).toHaveLength(1);
        expect(store._subscribers.get(extractor2).cbs).toContain(subscriber2);
        expect(store._subscribers.get(extractor2).cbs).not.toContain(subscriber1);
        expect(subscriber1).toHaveBeenCalledWith(selectedValue1);
        expect(subscriber2).toHaveBeenCalledWith(selectedValue2);
      });

      it('should call each subscriber with the result of the extractor on the reduced state when the Action is dispatched by the dispatcher', () => {
        const action = 'ACTION_NAME';
        const payload = { payload: 1 };

        const newSate = { state: 'new' };
        const condenser = jest.fn();

        const subscriber1 = jest.fn();
        const subscriber2 = jest.fn();
        const subscriber3 = jest.fn();

        const selectedValue = 'value';
        const extractor = jest.fn();

        store.addCondenser(action, condenser);
        store.subscribe(subscriber1, extractor);
        store.subscribe(subscriber2, extractor);

        jest.resetAllMocks();

        condenser.mockReturnValue(newSate);
        extractor.mockReturnValue(selectedValue);

        expect(store._subscribers.get(extractor).lastValue).toBeUndefined();

        actionListener(payload);
        store.subscribe(subscriber3, extractor);

        expect(extractor).toHaveBeenCalledTimes(1);
        expect(extractor).toHaveBeenCalledWith(newSate);
        expect(store._subscribers.get(extractor).lastValue).toBe(selectedValue);

        expect(subscriber1).toHaveBeenCalledWith(selectedValue);
        expect(subscriber2).toHaveBeenCalledWith(selectedValue);
        expect(subscriber3).toHaveBeenCalledWith(selectedValue);
      });
    });

    describe('execExtractor', () => {
      it('should return the value returned from the extractor', () => {
        const selectedValue = 'value';
        const extractor = jest.fn().mockReturnValue(selectedValue);
        const extractedValue = store.execExtractor(extractor);
        expect(extractedValue).toEqual(selectedValue);
      });
    });
  });
});