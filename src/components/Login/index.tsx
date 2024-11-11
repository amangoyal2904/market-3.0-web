"use client";

import styles from "./Login.module.scss";
import { APP_ENV, initSSOWidget, logout } from "../../utils";
import { useStateContext } from "../../store/StateContext";
import GLOBAL_CONFIG from "../../network/global_config.json";
import { trackingEvent } from "@/utils/ga";
import useLogin from "@/hooks/useLogin";
import { renderIconPaths } from "@/utils/iconUtils";

const Login = () => {
  useLogin();
  const { state } = useStateContext();
  const { isLogin, userInfo, ssoReady, isPrime } = state.login;

  const handleLoginToggle = () => {
    if (isLogin) {
      //setLogout();
    } else {
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "page_cta_click",
        event_label: "TopHeader_SignIn",
      });
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
                    <span className={styles.primeUsericon}>
                      <span className="eticon_prime_logo">
                        {renderIconPaths("eticon_prime_logo")}
                      </span>
                    </span>
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
                      loading="lazy"
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
                        loading="lazy"
                      />
                    </span>
                  )}
                </div>
                <div className={styles.userId}>{userInfo?.loginId}</div>
              </div>
              <ul className={styles.ddListWrap}>
                <li className={styles.ddList}>
                  <span className="eticon_user_profile"></span>
                  <a
                    href={`${(GLOBAL_CONFIG as any)[APP_ENV].ET_WEB_URL}userprofile.cms`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Edit Profile
                  </a>
                </li>
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
                  <span className="eticon_benefits"></span>
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
                    {renderIconPaths("eticon_watchlist")}
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
                  <span className="eticon_live_chat"></span>
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
