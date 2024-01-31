// loginReducer.ts
import { Reducer } from "react";

interface LoginState {
  isLogin: boolean;
  userInfo: any | null;
  error: any | null;
}

type LoginAction = { type: "LOGIN_SUCCESS"; payload: any } | { type: "LOGOUT"; payload: any };

const loginReducer: Reducer<LoginState, LoginAction> = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isLogin: true, userInfo: action.payload.userInfo, error: null };
    case "LOGOUT":
      return { ...state, isLogin: false, userInfo: {}, error: null };
    default:
      return state;
  }
};

export default loginReducer;
