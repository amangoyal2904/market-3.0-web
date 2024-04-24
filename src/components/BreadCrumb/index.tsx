"use client";
import React, { useEffect } from "react";
import styles from "./BreadCrumb.module.scss";
import { usePathname } from "next/navigation";

interface Props {
  pageName: string;
}
export const BreadCrumb: React.FC<Props> = ({ pageName }) => {
  const router = usePathname();
  useEffect(() => {
    console.log("BreadCrumb Route>>>>>", router);
    getLiPath();
  }, []);

  const getLiPath = () => {
    if (router == "/stocksrecos/overview") {
      return {
        showNextLi: false,
        currentLiNode: (
          <li>
            <span className="eticon_caret_right"></span>Stock Recommendations
          </li>
        ),
        showCurrLi: true,
      };
    } else if (router.includes("/stocksrecos/")) {
      return {
        showNextLi: true,
        currentLiNode: (
          <li>
            <span className="eticon_caret_right"></span>
            <a href="/stocksrecos/overview">Stock Recommendations</a>
          </li>
        ),
        showCurrLi: true,
      };
    } else if (router == "/markets/stock-screener") {
      return {
        showNextLi: false,
        currentLiNode: (
          <li>
            <span className="eticon_caret_right"></span>Stock Screener
          </li>
        ),
        showCurrLi: true,
      };
    } else if (router.includes("stock-screener/")) {
      return {
        showNextLi: true,
        currentLiNode: (
          <li>
            <span className="eticon_caret_right"></span>
            <a href="/markets/stock-screener">Stock Screener</a>
          </li>
        ),
        showCurrLi: true,
      };
    } else if (router.includes("/marketstats/")) {
      return {
        showNextLi: true,
        currentLiNode: (
          <li>
            <span className="eticon_caret_right"></span>Market Stats
          </li>
        ),
        showCurrLi: false,
      };
    } else if (router == "/markets/indices") {
      return {
        showNextLi: false,
        currentLiNode: (
          <li>
            <span className="eticon_caret_right"></span>Indices
          </li>
        ),
        showCurrLi: true,
      };
    } else if (router.includes("market-moods/")) {
      return {
        showNextLi: false,
        currentLiNode: (
          <li>
            <span className="eticon_caret_right"></span>Market Mood
          </li>
        ),
        showCurrLi: true,
      };
    } else {
      return {};
    }
  };

  return (
    <div className={styles.breadCrumbContainer}>
      <ul className={styles.brUl}>
        {router != "/home" && (
          <li className={styles.home}>
            <a href="/home">Markets Home</a>
          </li>
        )}
        {getLiPath().showCurrLi && getLiPath().currentLiNode}
        {getLiPath().showNextLi && pageName && (
          <li>
            <span className="eticon_caret_right"></span>
            {pageName}
          </li>
        )}
      </ul>
    </div>
  );
};
export default BreadCrumb;
