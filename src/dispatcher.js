export class Dispatcher {
    constructor() {
        this._actionListeners = {};
    }
    /**
     * This method will call each listener for the given actions.
     * 
     * @param {Action} action Action name
     * @param {Object} payload The action payload data
     */
    dispatch(action, payload) {
        if (!this._actionListeners[action]) {
            throw new Error(`${action} is not registered`);
        }

        this._actionListeners[action].forEach(listener => listener(payload));
    }

    /**
     * This method will add a listener process to be executed every time the action is dispatched.
     * 
     * @param {Action} action Action name
     * @param {Function} listener This is a listener function, it will receive the state and the action payload, it must return a new state or undefined if no changes in the state are necessary.
     * @returns the unsubscribe function.
     */
    addActionListener(action, listener) {
        this._actionListeners[action] = this._actionListeners[action] || [];
        this._actionListeners[action].push(listener);

        return () => {
            this.removeActionListener(action, listener);
        }
    }

    /**
     * This method will remove a listener from the listener list of the given action.
     * 
     * @param {Action} action Action name
     * @param {Function} listener This is a listener function, it will receive the state and the action payload, it must return a new state or undefined if no changes in the state are necessary.
     * @returns the unsubscribe function.
     */
    removeActionListener(action, listener) {
        // TODO investigate possible memory leaking.
        this._actionListeners[action] = this._actionListeners[action].filter(cb => cb !== listener);
    }
}

export const dispatcher = new Dispatcher();
