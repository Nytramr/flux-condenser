/**
 * The createExtractor function is a helper to easily create memoized extractor functions.
 * 
 * @param {Function} extractorFunction A function that is going to be executed every time extractor is activated by the store
 */
export const createExtractor = (extractorFunction) => {
  const cache = {};
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache[key]) {
      cache[key] = (state) => extractorFunction(state, ...args);
    }
    return cache[key];
  };
}