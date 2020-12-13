import { createStore } from "flux-condenser";
const storeName = Symbol("my-store");

// actions
export enum Actions {
  SET_HEADER = 'SET_HEADER',
  SET_SUB_TITLE = 'SET_SUB_TITLE',
}

type Header = {
  title: string;
  subTitle: string;
};

type Body = {
  amount: number;
  children: [];
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

export const store = createStore<Data, Actions>(storeName, {}, [
  [Actions.SET_HEADER, setHeader],
  [Actions.SET_SUB_TITLE, setBody],
]);
