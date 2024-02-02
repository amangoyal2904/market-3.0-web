'use client';

import { useEffect, useState } from 'react';
import styles from './Login.module.scss'
import { APP_ENV, verifyLogin, initSSOWidget, logout, loadPrimeApi } from "../../utils";
import { useStateContext } from "../../store/StateContext";

const Login = () => {
  const { state, dispatch } = useStateContext();
  const { isLogin, userInfo, ssoReady } = state.login;

  console.log(state.login);
  
  const verifyLoginSuccessCallback = async () => {
    try{
      const primeRes = await loadPrimeApi();
      //console.log(permissionRes.)

      if (primeRes.status === "SUCCESS") {
        const isPrime = primeRes.data && primeRes.data.permissions.some(function(item: any){
          return !item.includes("etadfree") && item.includes("subscribed");
        });

        window.objUser.permissions = primeRes.data.permissions || [];
        window.objUser.accessibleFeatures = primeRes.data.accessibleFeatures || [];
        window.objUser.primeInfo = primeRes.data;
        window.objUser.isPrime = isPrime;
      } else {
        window.objUser.permissions = [];
        window.objUser.accessibleFeatures = [];
        window.objUser.primeInfo = {};
        window.objUser.isPrime = false;
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          ssoReady: true,
          isLogin: true,
          isPrime: window.objUser.isPrime,
          userInfo: window.objUser?.info,
          ssoid: window.objUser?.ssoid,
          ticketId: window.objUser?.ticketId,
          accessibleFeatures: window.objUser.accessibleFeatures,
          permissions: window.objUser.permissions
        }
      });
    }catch(e){
      console.log("verifyLogin Catch", e);  
    }
  }

  const getUserDetailsSuccessCallback = () => {
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        ssoReady: true,
        isLogin: true,
        isPrime: window.objUser.isPrime,
        userInfo: window.objUser?.info,
        ssoid: window.objUser?.ssoid,
        ticketId: window.objUser?.ticketId,
        accessibleFeatures: window.objUser.accessibleFeatures,
        permissions: window.objUser.permissions
      }
    });
  }

  const authFailCallback = () => {
    console.log("authFailCallback");
    dispatch({
      type: "LOGOUT",
      payload: {
        ssoReady: true,
        isLogin: false,
        isPrime: false,
        userInfo: {},
        ssoid: "",
        ticketId: "",
        accessibleFeatures: [],
        permissions: []
      }
    });
  }

  const jssoLoadedCallback = () => {
    verifyLogin();
  }
  
  useEffect(() => {
    document.addEventListener("jssoLoaded", jssoLoadedCallback);

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
      ssoReady ? (isLogin ? 
        <div className={styles.menuWrap}>
          <span className={styles.userName}>
            <img width="34" height="34" src={userInfo?.thumbImageUrl} />
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
