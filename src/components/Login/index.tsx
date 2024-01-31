import { useEffect, useState } from 'react';
import styles from './Login.module.scss'
import { APP_ENV, verifyLogin, initSSOWidget, logout } from "../../utils";

interface IUser {
  firstName?: string;
  ssoid?: string;
  primaryEmail?: string;
}

const Login = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [ssoReady, setSsoReady] = useState(false);
  const [userInfo, setUserInfo] = useState<IUser>({});

  const verifyLoginSuccessCallback = () => {
    setIsLogin(true);  
  }

  const getUserDetailsSuccessCallback = () => {
    setUserInfo(window.objUser || {});  
  }

  const jssoLoadedCallback = () => {
    verifyLogin();  
    setSsoReady(true);
  }
  
  useEffect(() => {
    document.addEventListener("jssoLoaded", jssoLoadedCallback);
    document.addEventListener("verifyLoginSuccess", verifyLoginSuccessCallback);
    document.addEventListener("getUserDetailsSuccess", getUserDetailsSuccessCallback);
    return () => {
      document.removeEventListener("verifyLoginSuccess", verifyLoginSuccessCallback);
      document.addEventListener("getUserDetailsSuccess", getUserDetailsSuccessCallback);
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
      ssoReady ? (!isLogin ? 
      <div className={styles.defaultLink} data-ga-onclick="ET Login#Signin - Sign In - Click#ATF - url" onClick={handleLoginToggle}>Sign In</div>
      :
        <div className={styles.menuWrap}>
          <span className={styles.userName}>{userInfo?.firstName}</span>
          <div className={styles.menuListWrap}>
            <span onClick={logout}>Logout</span>
          </div>
        </div>
      )
      : <div className={styles.loginSpace} />
    }
  </>
}

export default Login;
