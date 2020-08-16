import { createExtractor, createMemoExtractor } from '../src/extractors';

describe('Extractors', () => {
  describe('createExtractor', () => {
    it('should return a new function', () => {
      const extractorMatrix = createExtractor(() => {
        return true;
      });

      expect(extractorMatrix).toEqual(expect.any(Function));
    });

    it('should return the different function for the same arguments', () => {
      const extractorMatrix = createExtractor(() => {
        return true;
      });

      const extractor1 = extractorMatrix('parameter 1');
      const extractor2 = extractorMatrix('parameter 1');

      expect(extractor1).not.toBe(extractor2);
    });

    it('should return the different functions for different arguments', () => {
      const extractorMatrix = createExtractor(() => {
        return true;
      });

      const extractor1 = extractorMatrix('parameter 1');
      const extractor2 = extractorMatrix('parameter 2');

      expect(extractor1).not.toBe(extractor2);
    });

    describe('extractor use', () => {
      it('should return the value from state', () => {
        const st = {
          value: 12,
        };
  
        const extractorMatrix = createExtractor((state) => {
          return state.value;
        });
  
        const extractor = extractorMatrix();
  
        expect(extractor(st)).toEqual(12);
      });
  
      it('should return the right value depending of the argument', () => {
        const st = {
          key1: 12,
          key2: 24,
        };
  
        const extractorMatrix = createExtractor((state, key) => {
          return state[key];
        });
  
        const extractor1 = extractorMatrix('key1');
        const extractor2 = extractorMatrix('key2');
  
        expect(extractor1(st)).toEqual(12);
        expect(extractor2(st)).toEqual(24);
      });
  
      it('should return the right value depending of the state', () => {
        const st1 = {
          key1: 12,
        };
  
        const st2 = {
          key1: 24,
        };
  
        const extractorMatrix = createExtractor((state, key) => {
          return state[key];
        });
  
        const extractor = extractorMatrix('key1');
  
        expect(extractor(st1)).toEqual(12);
        expect(extractor(st2)).toEqual(24);
      });
    });
  });

  describe('createMemoExtractor', () => {
    it('should return a new function', () => {
      const extractorMatrix = createMemoExtractor(() => {
        return true;
      });

      expect(extractorMatrix).toEqual(expect.any(Function));
    });

    it('should return the same function for the same arguments', () => {
      const extractorMatrix = createMemoExtractor(() => {
        return true;
      });

      const extractor1 = extractorMatrix('parameter 1');
      const extractor2 = extractorMatrix('parameter 1');

      expect(extractor1).toBe(extractor2);
    });

    it('should return the different functions for different arguments', () => {
      const extractorMatrix = createMemoExtractor(() => {
        return true;
      });

      const extractor1 = extractorMatrix('parameter 1');
      const extractor2 = extractorMatrix('parameter 2');

      expect(extractor1).not.toBe(extractor2);
    });

    describe('extractor use', () => {
      it('should return the value from state', () => {
        const st = {
          value: 12,
        };
  
        const extractorMatrix = createMemoExtractor((state) => {
          return state.value;
        });
  
        const extractor = extractorMatrix();
  
        expect(extractor(st)).toEqual(12);
      });
  
      it('should return the right value depending of the argument', () => {
        const st = {
          key1: 12,
          key2: 24,
        };
  
        const extractorMatrix = createMemoExtractor((state, key) => {
          return state[key];
        });
  
        const extractor1 = extractorMatrix('key1');
        const extractor2 = extractorMatrix('key2');
  
        expect(extractor1(st)).toEqual(12);
        expect(extractor2(st)).toEqual(24);
      });
  
      it('should return the right value depending of the state', () => {
        const st1 = {
          key1: 12,
        };
  
        const st2 = {
          key1: 24,
        };
  
        const extractorMatrix = createMemoExtractor((state, key) => {
          return state[key];
        });
  
        const extractor = extractorMatrix('key1');
  
        expect(extractor(st1)).toEqual(12);
        expect(extractor(st2)).toEqual(24);
      });
    });
  });
});