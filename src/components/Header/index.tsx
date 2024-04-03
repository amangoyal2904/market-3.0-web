"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import Link from "next/link";
import Search from "../Search";
import Login from "../Login";
import { APP_ENV } from "../../utils";
import { useStateContext } from "../../store/StateContext";
import GLOBAL_CONFIG from "../../network/global_config.json";
import dynamic from "next/dynamic";

import ETLogo from "../../../public/et_markets_logo.svg";

const LiveMarketData = dynamic(() => import("../LiveMarketData"), {
  ssr: false,
});

const Header = () => {
  const { state, dispatch } = useStateContext();
  const { isLogin, isPrime, ssoReady } = state.login;
  const [windowWidth, setWindowWidth] = useState<number>();
  const shouldRenderComponent = !!windowWidth ? windowWidth >= 1280 : true;
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <header id={styles.pageTopbar}>
      <div className={styles.navbarHeader} id="header">
        <div className={`dflex align-item-center ${styles.logoHeader}`}>
          <Link href="/">
            <Image
              src={ETLogo}
              width={138}
              height={24}
              quality={100}
              alt="ET Markets"
            />
          </Link>
        </div>

        <div
          className={`dflex align-item-center ${styles.headerRightContainer}`}
        >
          <div className={styles.headerMidContainer}>
            <Search />
          </div>
          <div className={`dflex align-item-center`}>
            {shouldRenderComponent && <LiveMarketData />}
            <Link className="default-btn" href="/watchlist">
              My Watchlist
            </Link>
            {!isPrime && (
              <Link
                className={`default-btn ${styles.subscribeBtn}`}
                href={`${(GLOBAL_CONFIG as any)[APP_ENV]["Plan_PAGE"]}`}
                data-ga-onclick="Subscription Flow#SYFT#ATF - url"
              >
                <img
                  src="/prime_icon.svg"
                  height="12"
                  width="12"
                  className={styles.prime_icon}
                />
                Subscribe
              </Link>
            )}
            <Login />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
