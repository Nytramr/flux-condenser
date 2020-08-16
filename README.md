# Flux Condenser
**Condenser**: _Another term for capacitor._

This is a small lightweight but powerful, implementation of [Facebook's Flux architecture](https://facebook.github.io/flux/).

**Important** Flux Condenser is not compatible with IE.

## Why to make another Flux implementation?
This implementation differs, from other implementations of Flux, in a fundamental aspect: Subscriptions.

Stores are subscribed to the dispatcher to listen to actions separately.
This means that only those callbacks subscribed to the dispatched action are executed, therefore the developer doesn't need to implement the huge `switch` to determine which action was called.

Also, whatever needs to subscribe to changes in a Store, it does through a subscription to an extractor function.
Every time the store changes, it runs every extractor annotated to it, and for each extractor that changed from the previous execution, subscribers are notified of the change.

## Parts

### Dispatcher
The dispatcher is the main orchestrator of the architecture. Every action is sent through the dispatcher and the dispatcher will inform each listener registered to that action.

It is highly recommended to use a single dispatcher for the entire application, although nothing prevents the developer to create multiple dispatchers instances if it is required.

#### Global dispatcher
The global dispatcher is accessible from:
```javascript
import {dispatcher} from 'flux-condenser';
```
or
```javascript
const fluxCondenser = require('flux-condenser');
fluxCondenser.dispatcher;
```

### Stores
Stores are where the data lives. They must subscribe to a dispatcher to process the actions sent to them.

#### createStore
There is a `createStore` helper function to easily create a store that is connected to the global dispatcher.

##### Usage
```javascript
import { createStore } from 'flux-condenser';
// or
const { createStore } = require('flux-condenser');

const storeName = Symbol('store6');
const initialValue = { count: 0};

const condenser = function (state) {
  return {
    count: state.count + 1,
  };
};

const condensers = [
  ['ACCUMULATE', condenser],
];

const store = createStore(storeName, initialValue, condensers);

export store;
// or
module.exports.store = store;
```

### Extractors
Extractors are functions that receive the `state` as a parameter and return a part of that `state`. For example:
```javascript
function extractorExample(state) {
  return state.interestingProperty;
}
```

#### Adding an extractor to a store
A common use for the store is to listen to changes in the store's state. To do that, stores have a method `subscribe` that accepts a data handler and an extractor as arguments, for example:
```javascript
store.subscribe(
  function dataHandler(data) {
    // Do something with your data
  },
  function extractor(state) {
    // Return part of your 
  },
);
```
The `dataHandler` function will receive as an argument, whatever the `extractor` function returns.

Several `dataHandler` functions can be attached to a single `extractor`, so it is a good idea to share the extractor function to be reused wherever is needed, for example:

**extractor.js**
```javascript
export function getMessageCounter (state) {
  state.counter;
}
```

**header.js**
```javascript
import {getMessageCounter} from '/extractor.js';
import {store} from 'stores.js';

store.subscribe(
  function (counter) {
    document.title = "(" + counter + ") messages";
  },
  getMessageCounter,
);
```

**messages.js**
```javascript
import {getMessageCounter} from '/extractor.js';
import {store} from 'stores.js';

store.subscribe(
  function (counter) {
    document.getElementById('messages-badge').textContent = counter;
  },
  getMessageCounter,
);
```
#### createExtractor
`createExtractor` is a helper function to create extractors that require extra parameters besides the `state`. There is also `createMemoExtractor` helper that provides a level of cache (memoization) returning the same function for the same input parameters.

##### Usage
```javascript
import { createExtractor } from 'flux-condenser';
// or
const { createExtractor } = require('flux-condenser');

const getOptionForIdExtractor = createExtractor(function (state, id) {
  return state.options[id];
});

// store was created before
store.subscribe(
  function (option) {
    // Do something with the options.
  },
  getOptionForIdExtractor('id1'),
);

store.subscribe(
  function (option) {
    // Do something with the options.
  },
  getOptionForIdExtractor('id2'),
);
```

#### Execute extractors on demand
Stores can also execute extractors on demand. When that happens, the store will execute the given extractor against its `state` and return the extractor result.

##### Usage
```javascript
import { createExtractor } from 'flux-condenser';
// or
const { createExtractor } = require('flux-condenser');

const getOptionForIdExtractor = createExtractor(function (state, id) {
  return state.options[id];
});

// store was created before
const option = store.execExtractor(
  getOptionForIdExtractor('id1'),
);
```

### Actions
Actions are more like a concept rather than a function perse. Raising an action is just calling the dispatcher with an action name and a payload, to be spread to those stores that are subscribed to that action.

There are two ways to dispatch an action:

**From a dispatcher**
```javascript
dispatcher.dispatch('ACTION_NAME', { payload: value });
```

**From a store**
```javascript
// store was created before
store.dispatch('ACTION_NAME', { payload: value });
```

## Webpack with multiple bundles
Flux Condenser module should be included only once per application. In a multiple bundle Webpack solution, it means we need to extract the Flux Condenser module in a separate bundle that is going to be used by every other bundle. Webpack must be configured with the [optimization runtimeChunk](https://webpack.js.org/configuration/optimization/#optimizationruntimechunk) option to create a runtime chunk with common modules.

```
module.exports = {
  entry: {...},
  output: {...},
  module: {...},
  optimization: {
    runtimeChunk: 'single',
    ...
  },
};
```

## Collaboration
I am working on the first fully implemented version of this library, once that is done, I will accept PRs.
