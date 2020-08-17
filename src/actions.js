import { dispatcher as globalDispatcher } from './dispatcher';

/**
 * The createActionDispatcher function is a helper to easily create action builders functions that are already connected to the .
 * 
 * @param {String} action The action name to be dispatched
 * @param {Function} payloadBuilder A function that will receive arguments and can build the proper payload
 * 
 * @returns A function that will create a payload, using the given payloadBuilder function and call the global dispatcher 
 * using the given action name ahd the result of the payloadBuilder as the action payload.
 */
export const createActionDispatcher = (action, payloadBuilder) => {
  return (...args) => {
    const payload = payloadBuilder(...args);
    globalDispatcher.dispatch(action, payload);
  };
}