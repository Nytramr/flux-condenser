export function createMemoExtractor<T>(extractorFunction: Function): (...args: any[]) => (state: T) => any;
export function createExtractor<T>(extractorFunction: Function): (...args: any[]) => (state: T) => any;
