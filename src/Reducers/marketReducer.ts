// loginReducer.ts
import { Reducer } from "react";

interface marketState {
  currentMarketStatus: string;
  marketStatus: string;
  error: any | null;
}

type marketAction = { type: "MARKET_STATUS"; payload: any };

const marketReducer: Reducer<marketState, marketAction> = (state, action) => {
  switch (action.type) {
    case "MARKET_STATUS":
      return {
        ...state,
        currentMarketStatus: action.payload.currentMarketStatus,
        marketStatus: action.payload.marketStatus,
        error: null,
      };

    default:
      return state;
  }
};

export default marketReducer;
