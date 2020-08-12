# Flux Condenser
**Condenser**: _Another term for capacitor._

This is a small lightweight but powerful, implementation of [Facebook's Flux architecture](https://facebook.github.io/flux/).

**Important** Flux Condenser is not compatible with IE.

## Why to make another Flux implementation?
This implementation differs from other implementations of Flux in a main aspect: Subscriptions.

Stores are subscribed to the dispatcher to listen to actions separately.
This means that only those callbacks subscribed to the dispatched action are executed, therefore the developer doesn't need to implement the huge `switch` to determine which action was called.

In addition, whatever needs to subscribe to changes in a Store, it does through a subscription to a extractor function.
Every time the store changes, it runs every extractor annotated to it, and for each extractor that changed from the previous execution, subscribers are notified of the change.

## Parts

### Dispatcher
The dispatcher is the main orchestrator of the architecture. Every action is sent through the dispatcher and the dispatcher will inform to each listener registered to that action.

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
Stores are where the data lives. They must subscribe to a dispatcher in order to process the actions sent to it.

#### createStore
There is a `createStore` helper function to easily create a store that is connected to the global dispatcher.

##### usage
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


### Actions

## Webpack with multiple bundles
Flux Condenser module should be included only once per application. In a multiple bundle Webpack solution, it means we need to extract the Flux Condenser module in a separated bundle that is going to be used by every other bundles. Webpack must be configure with the [optimization runtimeChunk](https://webpack.js.org/configuration/optimization/#optimizationruntimechunk) option to create a runtime chunk with common modules.

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

## Flux condenser is not Open Source yet
I am working on the first fully implemented version of this library, once that is done, I will migrate this library to a public repository.
