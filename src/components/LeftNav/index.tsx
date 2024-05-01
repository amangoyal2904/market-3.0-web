"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { usePathname } from "next/navigation";
import Link from "next/link";

const LeftNav = (props: any) => {
  const { leftNavResult = {} } = props;
  const { markets = {}, markets_pro = {} } = leftNavResult;
  const [isExpanded, setIsExpanded] = useState(true);
  const [isL2Expanded, setIsL2Expanded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {}, [pathname]);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
    setIsL2Expanded(!isL2Expanded);
  };

  const toggleL2Menu = (e: any) => {
    try {
      const navWrapEle = document.querySelector(`.${styles["navWrap"]}`);
      const parentElem = e.target.parentNode;
      const elm = parentElem.classList.contains(styles["mainTabWrap"])
        ? parentElem.parentNode
        : parentElem;

      if (navWrapEle?.classList.contains(styles["expanded"])) {
        if (elm.classList.contains(styles["l2Collapsed"])) {
          elm.classList.remove(styles["l2Collapsed"]);
          elm.classList.add(styles["l2Expanded"]);
        } else {
          elm.classList.remove(styles["l2Expanded"]);
          elm.classList.add(styles["l2Collapsed"]);
        }
      }
    } catch (e) {
      console.log("Error toggleL2Menu: ", e);
    }
  };

  const handleMainHover = () => {
    const element = document.querySelector(`.${styles.navWrap}`);
    let hoverTimeout: any;

    element?.addEventListener("mouseenter", function () {
      hoverTimeout = setTimeout(function () {
        element.classList.add(styles.hovered);
      }, 200); // 500 milliseconds delay
    });

    element?.addEventListener("mouseleave", function () {
      clearTimeout(hoverTimeout);
      element?.classList.remove(styles.hovered);
    });
  };

  useEffect(() => {
    handleMainHover();
  }, []);

  const hasUrlSelect = (str1: string) => {
    //console.log("hasUrlSelect -- ", str1, pathname, pathname.includes(str1))
    return pathname.includes(str1);
  };

  return (
    <div
      className={`${styles.navWrap} ${isExpanded ? styles.expanded : styles.collapsed}`}
    >
      <div className={styles.navInnerWrap}>
        <div className={styles.toggleMenuWrap}>
          <span
            className={`${styles.toggleMenu} ${isExpanded ? "eticon_prev" : "eticon_next"}`}
            onClick={toggleMenu}
          ></span>
        </div>
        <div className={styles.navOptWrap}>
          <ul className={styles.marketNavWrap}>
            {markets?.nav?.map((value: any, index: any) => {
              return (
                <li
                  className={`${styles.navListWrap} ${!isExpanded ? styles.l2Collapsed : ""}`}
                  key={`market_nav_${index}`}
                >
                  {value.link ? (
                    <Link
                      href={value.link}
                      className={`${styles.mainTabWrap} ${hasUrlSelect(value.matchPattern) ? styles.active : ""}`}
                    >
                      <span
                        className={`${value.icon} ${styles.navIcon}`}
                      ></span>
                      <span
                        className={`${!isExpanded ? styles.hide : ""} ${styles.l1LabelName}`}
                      >
                        {value.label}
                      </span>
                      {value.sec && (
                        <span
                          className={`eticon_caret_right ${styles.caret_right}`}
                        ></span>
                      )}
                    </Link>
                  ) : (
                    <>
                      <div
                        className={styles.mainTabWrap}
                        onClick={(e) => {
                          value.sec && toggleL2Menu(e);
                        }}
                      >
                        <span
                          className={`${value.icon} ${styles.navIcon}`}
                        ></span>
                        <span
                          className={`${!isExpanded ? styles.hide : ""} ${styles.l1LabelName}`}
                        >
                          {value.label}
                        </span>
                        {value.sec && (
                          <span
                            className={`eticon_caret_right ${styles.caret_right}`}
                          ></span>
                        )}
                      </div>
                      <ul
                        className={styles.l2ListWrap}
                        key={`market_nav___${index}`}
                      >
                        {value?.sec.map((sec: any, index: number) => {
                          return (
                            <li
                              className={`${styles.l2List} ${hasUrlSelect(sec.matchPattern) ? styles.active : ""}`}
                              key={`l2_label_${index}`}
                            >
                              <Link href={sec.link}>{sec.label}</Link>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          <div className={styles.marketProWrap}>
            <h3 className={styles.proHeading}>
              <span className={styles.expandTitle}>
                <span className="eticon_prime_logo">
                  <span className="path1"></span>
                  <span className="path2"></span>
                  <span className="path3"></span>
                </span>
                <span className={styles.etprimeLogoText}>ETPrime</span>
              </span>
              <span className={styles.collapsedTitle}>
                <span className="eticon_prime_logo">
                  <span className="path1"></span>
                  <span className="path2"></span>
                  <span className="path3"></span>
                </span>
              </span>
              {/* {isExpanded ?  : } */}
            </h3>
            <ul>
              {markets_pro?.nav?.map((value: any, index: any) => {
                return (
                  <li
                    className={styles.navListWrap}
                    key={`market_pro_nav_${index}`}
                  >
                    <Link
                      href={value.link}
                      className={`${styles.mainTabWrap} ${hasUrlSelect(value.matchPattern) ? styles.active : ""}`}
                    >
                      <span
                        className={`${value.icon} ${styles.navIcon}`}
                      ></span>
                      <span
                        className={`${!isExpanded ? styles.hide : ""} ${styles.l1LabelName}`}
                      >
                        {value.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftNav;
