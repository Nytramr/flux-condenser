export function createActionDispatcher<A>(action: A, payloadBuilder: Function): (...args: any[]) => void;
