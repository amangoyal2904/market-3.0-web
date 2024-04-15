"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useStateContext } from "../../store/StateContext";
import ETLogo from "../../../public/et_markets_logo.svg";
import { goToPlansPage } from "@/utils/ga";
import styles from "./Header.module.scss";
import Login from "../Login";
import Search from "../Search";

const LiveMarketData = dynamic(() => import("../LiveMarketData"), {
  ssr: false,
});

const Header = () => {
  const { state } = useStateContext();
  const { isPrime } = state.login;
  const [shouldRenderComponent, setShouldRenderComponent] = useState(false);

  const handleResize = useCallback(() => {
    setShouldRenderComponent(window.innerWidth >= 1280);
  }, []);

  useEffect(() => {
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

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
              <span
                className={`default-btn ${styles.subscribeBtn}`}
                onClick={goToPlansPage}
              >
                <img
                  src="/prime_icon.svg"
                  height="12"
                  width="12"
                  className={styles.prime_icon}
                />
                Subscribe
              </span>
            )}
            <Login />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
