type Extractor<T, O = any> = (state: T) => O;

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
export function createMemoExtractor<T, A extends any[], O = any>(extractorFunction: (state: T, ...args: A) => O): (...args: A) => Extractor<T, O>;

/**
 * The createExtractor function is a helper to easily create extractor functions.
 * 
 * @param {Function} extractorFunction A function that is going to be executed every time extractor is activated by the store
 * 
 * @returns {Function} A constructor function to create extractors, using the extractorFunction. This constructor 
 * function accepts arguments as parameter that will be past to the extractorFunction, after the state argument.
 */
export function createExtractor<T, A extends any[], O = any>(extractorFunction: (state: T, ...args: A) => O): (...args: A) => Extractor<T, O>;
