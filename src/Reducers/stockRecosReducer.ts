// stockRecosReducer.ts
import { Reducer } from "react";

interface stockRecosState {
  viewType: [];
  error: any | null;
}

type stockRecosAction = { type: "UPDATE_VIEWTYPE"; payload: any };

const stockRecosReducer: Reducer<stockRecosState, stockRecosAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case "UPDATE_VIEWTYPE":
      return {
        ...state,
        viewType: action.payload.viewType,
        error: null,
      };
    default:
      return state;
  }
};

export default stockRecosReducer;
