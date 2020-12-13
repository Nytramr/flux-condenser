export type Action<A> = {
  action: A;
  payload: any;
};

export class Dispatcher<A> {
  /**
   * This method will call each listener for the given action.
   *
   * @param {Action} action An object containing the action name and the action Payload.
   */
  dispatch({ action, payload }: Action<A>): void;
  /**
   * This method will add a listener process to be executed every time the action is dispatched.
   *
   * @param {String} action Action name
   * @param {Function} listener This is a listener function, it will receive the state and the action payload, it must return a new state or undefined if no changes in the state are necessary.
   * @returns the unsubscribe function.
   */
  addActionListener(action: A, listener: Function): () => void;
  /**
   * This method will remove a listener from the listeners list for the given action.
   *
   * @param {String} action Action name
   * @param {Function} listener This is a listener function, it will receive the state and the action payload, it must return a new state or undefined if no changes in the state are necessary.
   */
  removeActionListener(action: A, listener: Function): void;
}

type GlobalDispatcher<A = any> = Dispatcher<A>;

export const dispatcher: GlobalDispatcher;
