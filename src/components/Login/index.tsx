'use client';

import { useEffect, useState } from 'react';
import styles from './Login.module.scss'
import { APP_ENV, verifyLogin, initSSOWidget, logout } from "../../utils";
import { useStateContext } from "../../store/StateContext";

const Login = () => {
  const [ssoReady, setSsoReady] = useState(false);
  const { state, dispatch } = useStateContext();
  const { isLogin, userInfo } = state.login;
  
  const verifyLoginSuccessCallback = () => {
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        userInfo: window.objUser,
        isLogin: true
      }
    });
  }

  const getUserDetailsSuccessCallback = () => {
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        userInfo: window.objUser,
        isLogin: true
      }
    });
  }

  const authFailCallback = () => {
    console.log("authFailCallback");
    dispatch({
      type: "LOGOUT",
      payload: {
        userInfo: window.objUser,
        isLogin: false,
      }
    });
  }

  const jssoLoadedCallback = () => {
    verifyLogin();
    setSsoReady(true);
  }
  
  useEffect(() => {
    if (typeof window.jsso !== "undefined") {
      jssoLoadedCallback();
    }else{
      document.addEventListener("jssoLoaded", jssoLoadedCallback);
    }
    

    document.addEventListener("verifyLoginSuccess", verifyLoginSuccessCallback);
    document.addEventListener("verifyLoginFail", authFailCallback);

    document.addEventListener("getUserDetailsSuccess", getUserDetailsSuccessCallback);
    document.addEventListener("getUserDetailsFail", authFailCallback);
    return () => {
      document.removeEventListener("jssoLoaded", jssoLoadedCallback);

      document.removeEventListener("verifyLoginStatus", verifyLoginSuccessCallback);
      document.removeEventListener("verifyLoginFail", authFailCallback);

      document.removeEventListener("getUserDetailsSuccess", getUserDetailsSuccessCallback);
      document.removeEventListener("getUserDetailsFail", authFailCallback);
    };

  }, []);

  const handleLoginToggle = (): void => {
    if (isLogin) {
      //setLogout();
    } else {
      initSSOWidget();
    }
  };

  return <>
    {
      ssoReady ? (isLogin ||  typeof window.objUser != "undefined" ? 
        <div className={styles.menuWrap}>
          <span className={styles.userName}>
            <img width="34" height="34" src={userInfo?.thumbImageUrl || window?.objUser?.thumbImageUrl} />
          </span>
          <div className={styles.menuListWrap}>
            <span onClick={logout}>Logout</span>
          </div>
        </div>
      : <div className={styles.defaultLink} data-ga-onclick="ET Login#Signin - Sign In - Click#ATF - url" onClick={handleLoginToggle}>Sign In</div>  
      )
      : <div className={styles.loginSpace} />
    }
  </>
}

export default Login;
