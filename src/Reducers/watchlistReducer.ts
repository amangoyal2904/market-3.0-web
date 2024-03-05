// watchlistReducer.ts
import { Reducer } from "react";

interface watchlistState {
  watchlist: [];
  error: any | null;
}

type watchlistAction = { type: "UPDATE_MSID"; payload: any };

const watchlistReducer: Reducer<watchlistState, watchlistAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case "UPDATE_MSID":
      return {
        ...state,
        watchlist: action.payload.watchlist,
        error: null,
      };
    default:
      return state;
  }
};

export default watchlistReducer;
