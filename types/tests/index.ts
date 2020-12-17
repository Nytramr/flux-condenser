/// <reference types="node" />

import { createStore, createExtractor } from "flux-condenser";
const storeName = Symbol("my-store");

// actions
export enum Actions {
  SET_HEADER = "SET_HEADER",
  SET_SUB_TITLE = "SET_SUB_TITLE",
}

// Store data types
type Header = {
  title: string;
  subTitle: string;
};

type Body = {
  amount: number;
  children: Record<string, string>;
};

type Data = {
  header?: Header;
  body?: Body;
};

// condensers
function setHeader(initialState: Data, payload: Header): Data {
  return {
    ...initialState,
    header: payload,
  };
}

function setBody(initialState: Data, payload: Body): Data {
  return {
    ...initialState,
    body: payload,
  };
}

// Create a store
export const store = createStore<Data, Actions>(storeName, {}, [
  [Actions.SET_HEADER, setHeader],
  [Actions.SET_SUB_TITLE, setBody],
]);

// Extractors
const getBodyExtractor = (data: Data) => {
  return data.body;
};

// Extractors creators
const extractorFunction = (data: Data, id: string): string | undefined => {
  return data.body && data.body.children[id];
};
const extractor = createExtractor<Data, [string], string | undefined>(extractorFunction);

// Add extractors to store
store.subscribe((body: Body | undefined) => {
  console.log(body);
}, getBodyExtractor);

store.subscribe((body: string | undefined) => {
  console.log(body);
}, extractor('some id'));

