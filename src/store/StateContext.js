"use client";

import React, { createContext, useContext, useReducer } from "react";
import combineReducers from "./combinedReducers";
import loginReducer from "../Reducers/loginReducer.ts";
import marketReducer from "../Reducers/marketReducer.ts";
import watchlistReducer from "../Reducers/watchlistReducer.ts";
import stockRecosReducer from "../Reducers/stockRecosReducer.ts";
import marketMoodReducer from "../Reducers/marketMoodReducer";

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
  watchlistStatus: {
    watchlist: [],
    error: null,
  },
  StockRecosStatus: {
    viewType: "card",
    error: null,
  },
  MarketMoodStatus: {
    countPercentage: "percentage",
    duration: "1M",
    monthlyDaily: "daily",
    error: null,
  },
};

const StateContext = createContext();

export function StateProvider({ children }) {
  const [state, dispatch] = useReducer(
    combineReducers({
      login: loginReducer,
      marketStatus: marketReducer,
      watchlistStatus: watchlistReducer,
      StockRecosStatus: stockRecosReducer,
      MarketMoodStatus: marketMoodReducer,
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
