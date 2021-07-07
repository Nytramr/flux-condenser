import { dispatcher } from '../src/dispatcher';
import { createActionDispatcher } from '../src/actions';

jest.mock('../src/dispatcher');

describe('Actions', () => {
  describe('createActionDispatcher', () => {
    it('should return a new function', () => {
      const action1Dispatcher = createActionDispatcher(() => {
        return true;
      });

      expect(action1Dispatcher).toEqual(expect.any(Function));
    });

    describe('action use', () => {
      it('should call the dispatcher', () => {
        const action1Dispatcher = createActionDispatcher('ACTION_1', (property1, property2) => {
          return {
            property1,
            property2,
          };
        });

        action1Dispatcher('value1', 'value2');

        expect(dispatcher.dispatch).toHaveBeenCalledTimes(1);
        expect(dispatcher.dispatch).toHaveBeenCalledWith({
          action: 'ACTION_1',
          payload: { property1: 'value1', property2: 'value2' },
        });
      });
    });
  });
});
