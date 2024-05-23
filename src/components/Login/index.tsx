"use client";

import { useEffect, useState } from "react";
import styles from "./Login.module.scss";
import {
  APP_ENV,
  verifyLogin,
  initSSOWidget,
  logout,
  loadPrimeApi,
  setCookieToSpecificTime,
  delete_cookie,
} from "../../utils";
import { fetchAllWatchListData } from "../../utils/utility";
import { useStateContext } from "../../store/StateContext";
import GLOBAL_CONFIG from "../../network/global_config.json";

const Login = () => {
  const { state, dispatch } = useStateContext();
  const { isLogin, userInfo, ssoReady, isPrime } = state.login;

  //console.log(state.login);

  const fetchWatchListStocks = async () => {
    const data = await fetchAllWatchListData("Follow", 11);
    let watchlistArr = [];
    if (data?.resData?.length > 0) {
      watchlistArr = data?.resData.map((entry: any) => {
        return (
          entry.companyType && {
            companyId: entry.prefDataVal,
            companyType: entry.id,
          }
        );
      });
    } else if (data?.length > 0) {
      watchlistArr = data.map((entry: any) => {
        return (
          entry.companyType && {
            companyId: entry.prefDataVal,
            companyType: entry.companyType,
          }
        );
      });
    }

    console.log("watchlistArr----", watchlistArr);
    if (watchlistArr.length > 0) {
      dispatch({
        type: "UPDATE_MSID",
        payload: {
          watchlist: watchlistArr,
        },
      });
    }
  };

  const verifyLoginSuccessCallback = async () => {
    try {
      fetchWatchListStocks();
      const primeRes = await loadPrimeApi();
      //console.log(permissionRes.)

      if (primeRes.status === "SUCCESS") {
        const isPrime =
          primeRes.data &&
          primeRes.data.permissions.some(function (item: any) {
            return !item.includes("etadfree") && item.includes("subscribed");
          });
        window.objUser.permissions = primeRes.data.permissions || [];
        window.objUser.accessibleFeatures =
          primeRes.data.accessibleFeatures || [];
        window.objUser.primeInfo = primeRes.data;
        window.objUser.isPrime = isPrime;
        setCookieToSpecificTime("isprimeuser", isPrime, 30, 0, 0, "");

        if (primeRes && primeRes.token) {
          setCookieToSpecificTime("OTR", primeRes.token, 30, 0, 0, "");
        }
      } else {
        window.objUser.permissions = [];
        window.objUser.accessibleFeatures = [];
        window.objUser.primeInfo = {};
        window.objUser.isPrime = false;
        delete_cookie("isprimeuser");
        if (primeRes && primeRes.token) {
          delete_cookie("OTR");
        }
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
          permissions: window.objUser.permissions,
        },
      });
    } catch (e) {
      console.log("verifyLogin Catch", e);
    }
  };

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
        permissions: window.objUser.permissions,
      },
    });
  };

  const authFailCallback = () => {
    //console.log("authFailCallback");
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
        permissions: [],
      },
    });
  };

  const jssoLoadedCallback = () => {
    verifyLogin();
  };

  useEffect(() => {
    document.addEventListener("jssoLoaded", jssoLoadedCallback);
    document.addEventListener("verifyLoginSuccess", verifyLoginSuccessCallback);
    document.addEventListener("verifyLoginFail", authFailCallback);
    document.addEventListener(
      "getUserDetailsSuccess",
      getUserDetailsSuccessCallback,
    );
    document.addEventListener("getUserDetailsFail", authFailCallback);
    return () => {
      document.removeEventListener("jssoLoaded", jssoLoadedCallback);

      document.removeEventListener(
        "verifyLoginStatus",
        verifyLoginSuccessCallback,
      );
      document.removeEventListener("verifyLoginFail", authFailCallback);

      document.removeEventListener(
        "getUserDetailsSuccess",
        getUserDetailsSuccessCallback,
      );
      document.removeEventListener("getUserDetailsFail", authFailCallback);
    };
  }, []);

  const handleLoginToggle = () => {
    if (isLogin) {
      //setLogout();
    } else {
      initSSOWidget();
    }
  };

  const handleRedeemVoucher = () => {
    const voucherClicked = new Event("voucherClicked");
    document.dispatchEvent(voucherClicked);
  };

  return (
    <>
      {ssoReady ? (
        isLogin ? (
          <div
            className={`${styles.menuWrap} ${isPrime ? styles.primeMenu : ""}`}
          >
            <span className={styles.userProfile}>
              {isPrime ? (
                <>
                  <span className={`default-btn ${styles.defaultBtn}`}>
                    <img
                      src="/prime_icon.svg"
                      height="15"
                      width="15"
                      className={styles.primeUsericon}
                      alt="Prime User"
                      title="Prime User"
                    />
                    <div className={styles.primeInfo}>
                      <p className={styles.primeMember}>ETPrime Member</p>
                      <p className={styles.userName}>
                        {userInfo?.firstName} {userInfo?.lastName}
                      </p>
                    </div>
                    <span
                      className={`eticon_caret_down ${styles.signinDDArrow}`}
                    ></span>
                  </span>
                </>
              ) : (
                <>
                  {userInfo?.thumbImageUrl ? (
                    <img
                      width="34"
                      height="34"
                      className={styles.thumbImg}
                      src={userInfo?.thumbImageUrl}
                      alt={userInfo?.firstName}
                      title={userInfo?.firstName}
                    />
                  ) : (
                    <span className={styles.userFChar}>
                      {userInfo?.firstName.charAt(0)}
                    </span>
                  )}
                  <span
                    className={`eticon_caret_down ${styles.signinDDArrow}`}
                  ></span>
                </>
              )}

              {/* {userInfo?.thumbImageUrl ? (
                <img
                  width="34"
                  height="34"
                  className={styles.thumbImg}
                  src={userInfo?.thumbImageUrl}
                />
              ) : (
                <span className={styles.userFChar}>
                  {userInfo?.firstName.charAt(0)}
                </span>
              )} */}
              {/* <span className={`default-btn ${styles.defaultBtn}`}>
                  <img
                    src="/prime_icon.svg"
                    height="16"
                    width="16"
                    className={styles.primeUsericon}
                  />
                  <div className={styles.primeInfo}>
                    <p className={styles.primeMember}>ETPrime Member</p>
                    <p className={styles.userName}>{userInfo?.firstName} {userInfo?.lastName}</p>
                  </div>
                  <span className={`eticon_caret_down ${styles.signinDDArrow}`}></span>
                </span> */}
              {/* {isPrime && (
                <img
                  src="/prime_icon.svg"
                  height="12"
                  width="12"
                  className={styles.prime_icon}
                />
              )} */}
              {/* {isPrime && (
                <span className={`default-btn ${styles.defaultBtn}`}>
                  <img
                    src="/prime_icon.svg"
                    height="20"
                    width="20"
                    className={styles.prime_icon}
                  />
                  <div className={styles.primeInfo}>
                    <p className={styles.primeMember}>ETPrime Member</p>
                    <p className={styles.userName}>{userInfo?.firstName} {userInfo?.lastName}</p>
                  </div>
                  <span className={`eticon_caret_down ${styles.signinDDArrow}`}></span>
                </span>
              )} */}

              {/* <span
                className={`eticon_caret_down ${styles.signinDDArrow}`}
              ></span> */}
            </span>
            <div className={`${styles.menuListWrap}`}>
              <div className={styles.userNameWrap}>
                <div className={styles.userName}>
                  Hi, {userInfo?.firstName}{" "}
                  {isPrime && (
                    <span className={styles.ePrimeLogo}>
                      <span className={styles.separator}></span>
                      <img
                        width="72"
                        src="https://img.etimg.com/photo/105086027.cms"
                        alt={userInfo?.loginId}
                        title={userInfo?.loginId}
                      />
                    </span>
                  )}
                </div>
                <div className={styles.userId}>{userInfo?.loginId}</div>
              </div>
              <ul className={styles.ddListWrap}>
                {/* <li className={styles.ddList}>
                  <span className=""></span>
                  <a
                    href={`${(GLOBAL_CONFIG as any)[APP_ENV].ET_WEB_URL}userprofile.cms`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Edit Profile
                  </a>
                </li> */}
                <li className={styles.ddList}>
                  <span className="eticon_subscription"></span>
                  <a
                    href={`${(GLOBAL_CONFIG as any)[APP_ENV]["MY_SUBS"]}`}
                    rel="nofollow noreferrer"
                    target="_blank"
                    title="My Subscriptions"
                  >
                    My Subscriptions
                  </a>
                </li>
                <li className={styles.ddList}>
                  <span className="eticon_preferences"></span>
                  <a
                    href={`${(GLOBAL_CONFIG as any)[APP_ENV].ET_WEB_URL}prime_preferences.cms`}
                    rel="nofollow noreferrer"
                    target="_blank"
                    title="My Preferences"
                  >
                    My Preferences
                  </a>
                </li>
                <li className={styles.ddList}>
                  <img
                    className={styles.rght12}
                    src="/icon_svgs/Redeem_Benefits_01.svg"
                    alt="Redeem_Benefits_Icons"
                    title="Redeem_Benefits_Icons"
                    width="16"
                    height="23"
                  />
                  <a
                    href={`${(GLOBAL_CONFIG as any)[APP_ENV].ET_WEB_URL}et_benefits.cms`}
                    rel="nofollow noreferrer"
                    target="_blank"
                    title="Redeem Benefits"
                  >
                    Redeem Benefits
                  </a>
                </li>
                <li className={styles.ddList}>
                  <span className="eticon_newsletters"></span>
                  <a
                    href={`${(GLOBAL_CONFIG as any)[APP_ENV].ET_WEB_URL}subscription`}
                    rel="nofollow noreferrer"
                    target="_blank"
                    title="Manage Newsletters"
                  >
                    Manage Newsletters
                  </a>
                </li>
                <li className={styles.ddList}>
                  <span className="eticon_watchlist">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                    <span className="path4"></span>
                    <span className="path5"></span>
                  </span>
                  <a
                    href="/watchlist"
                    rel="nofollow noreferrer"
                    title="My Watchlist"
                  >
                    My Watchlist
                  </a>
                </li>
                <li className={styles.ddList}>
                  <span className="eticon_bookmark"></span>
                  <a
                    href={`${(GLOBAL_CONFIG as any)[APP_ENV].ET_WEB_URL}bookmarkslist`}
                    rel="nofollow noreferrer"
                    title="Saved Stories"
                  >
                    Saved Stories
                  </a>
                </li>
                <li className={styles.ddList}>
                  <span className="eticon_redeem_benefits"></span>
                  <span onClick={handleRedeemVoucher}>Redeem Voucher</span>
                </li>
                <li className={styles.ddList}>
                  {/* <span className="eticon_recos"></span> */}
                  <img
                    className={styles.rght12}
                    src="/icon_svgs/live-chat01.svg"
                    alt="Redeem Benefits"
                    title="Redeem Benefits"
                    width="18"
                    height="16"
                  />
                  <a
                    href={`${(GLOBAL_CONFIG as any)[APP_ENV].ET_WEB_URL}contactus.cms`}
                    rel="nofollow noreferrer"
                    target="_blank"
                    title="Contact Us"
                  >
                    Contact Us
                  </a>
                </li>
                <li className={styles.ddList}>
                  <span className="eticon_logout"></span>
                  <span onClick={logout}>Logout</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className={styles.defaultLink} onClick={handleLoginToggle}>
            Sign In
          </div>
        )
      ) : (
        <div className={styles.loginSpace} />
      )}
    </>
  );
};

export default Login;
