import { Reducer } from "react";

interface modalState {
  activeModal: string | null;
  error: any | null;
}

type modalAction =
  | { type: "SHOW_MODAL"; payload: any }
  | { type: "HIDE_MODAL" }
  | { type: "HIDE_ALL_MODALS" };

const modalReducer: Reducer<modalState, modalAction> = (state, action) => {
  switch (action.type) {
    case "SHOW_MODAL":
      return {
        ...state,
        activeModal: action.payload.activeModal,
      };
    case "HIDE_MODAL":
      return {
        ...state,
        activeModal: null,
      };
    case "HIDE_ALL_MODALS":
      return {
        ...state,
        activeModal: null,
      };
    default:
      return state;
  }
};

export default modalReducer;
