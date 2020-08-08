/**
 * The createSelector function is a helper to easily create memoized selector functions.
 * 
 * @param {Function} selectorFunction A function that is going to be executed every time selector is activated by the store
 */
export const createSelector = (selectorFunction) => {
  const cache = {};
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache[key]) {
      cache[key] = (state) => selectorFunction(state, ...args);
    }
    return cache[key];
  };
}