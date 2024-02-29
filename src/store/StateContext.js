"use client";

import React, { createContext, useContext, useReducer } from "react";
import combineReducers from "./combinedReducers";
import loginReducer from "../Reducers/loginReducer.ts";
import marketReducer from "../Reducers/marketReducer.ts";

const initialState = {
  login: {
    isLogin: "",
    userInfo: {},
    ssoid: "",
    ticketId: "",
    error: null,
  },
  marketStatus: {
    currentMarketStatus: "",
    error: null,
  },
};

const StateContext = createContext();

export function StateProvider({ children }) {
  const [state, dispatch] = useReducer(
    combineReducers({
      login: loginReducer,
      marketStatus: marketReducer,
    }),
    initialState,
  );

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
}

export function useStateContext() {
  return useContext(StateContext);
}
