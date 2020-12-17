/**
 * The createMemoExtractor function is a helper to easily create memoized extractor functions.
 * 
 * @param {Function} extractorFunction A function that is going to be executed every time extractor is activated by the store
 * 
 * @returns {Function} A constructor function to create extractors, using the extractorFunction. This constructor 
 * function accepts arguments as parameter that will be past to the extractorFunction, after the state argument.
 * It is worth to mention that the returned functions are memoized, therefore the same function is going to be
 * returned to the same given arguments.
 */
export const createMemoExtractor = (extractorFunction) => {
  const cache = {};
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache[key]) {
      cache[key] = (state) => extractorFunction(state, ...args);
    }
    return cache[key];
  };
}

/**
 * The createExtractor function is a helper to easily create extractor functions.
 * 
 * @param {Function} extractorFunction A function that is going to be executed every time extractor is activated by the store
 * 
 * @returns {Function} A constructor function to create extractors, using the extractorFunction. This constructor 
 * function accepts arguments as parameter that will be past to the extractorFunction, after the state argument.
 */
export const createExtractor = (extractorFunction) => {
  return (...args) => {
    return (state) => extractorFunction(state, ...args);
  };
}