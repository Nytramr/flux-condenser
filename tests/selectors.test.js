import { createSelector } from '../src/selectors';

describe('Selectors', () => {
  describe('createSelector', () => {
    it('should return a new function', () => {
      const selectorMatrix = createSelector(() => {
        return true;
      });

      expect(selectorMatrix).toEqual(expect.any(Function));
    });

    it('should return the same function for the same arguments', () => {
      const selectorMatrix = createSelector(() => {
        return true;
      });

      const selector1 = selectorMatrix('parameter 1');
      const selector2 = selectorMatrix('parameter 1');

      expect(selector1).toBe(selector2);
    });

    it('should return the different functions for different arguments', () => {
      const selectorMatrix = createSelector(() => {
        return true;
      });

      const selector1 = selectorMatrix('parameter 1');
      const selector2 = selectorMatrix('parameter 2');

      expect(selector1).not.toBe(selector2);
    });
  });

  describe('selector use', () => {
    it('should return the value from state', () => {
      const st = {
        value: 12,
      };

      const selectorMatrix = createSelector((state) => {
        return state.value;
      });

      const selector = selectorMatrix();

      expect(selector(st)).toEqual(12);
    });

    it('should return the right value depending of the argument', () => {
      const st = {
        key1: 12,
        key2: 24,
      };

      const selectorMatrix = createSelector((state, key) => {
        return state[key];
      });

      const selector1 = selectorMatrix('key1');
      const selector2 = selectorMatrix('key2');

      expect(selector1(st)).toEqual(12);
      expect(selector2(st)).toEqual(24);
    });

    it('should return the right value depending of the state', () => {
      const st1 = {
        key1: 12,
      };

      const st2 = {
        key1: 24,
      };

      const selectorMatrix = createSelector((state, key) => {
        return state[key];
      });

      const selector = selectorMatrix('key1');

      expect(selector(st1)).toEqual(12);
      expect(selector(st2)).toEqual(24);
    });
  });
});