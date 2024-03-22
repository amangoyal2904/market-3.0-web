// marketMoodReducer.ts
import { Reducer } from "react";

interface marketMoodState {
  countPercentage: string;
  duration: string;
  monthlyDaily: string;
  error: any | null;
}

type marketMoodAction = { type: "UPDATE_VIEWTYPES"; payload: any };

const marketMoodReducer: Reducer<marketMoodState, marketMoodAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case "UPDATE_VIEWTYPES":
      return {
        ...state,
        countPercentage:
          action.payload.countPercentage !== undefined
            ? action.payload.countPercentage
            : state.countPercentage,
        duration:
          action.payload.duration !== undefined
            ? action.payload.duration
            : state.duration,
        monthlyDaily:
          action.payload.monthlyDaily !== undefined
            ? action.payload.monthlyDaily
            : state.monthlyDaily,
        error: null,
      };
    default:
      return state;
  }
};

export default marketMoodReducer;
