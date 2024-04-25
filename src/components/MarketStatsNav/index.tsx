"use client";
import React, { Fragment } from "react";
import styles from "./MarketStatsNav.module.scss";
import Link from "next/link";

interface PageProps {
  leftNavResult: any;
  type: any;
  subType: any;
  shortUrlMapping: [];
  firstOperand: any;
  operationType: any;
  secondOperand: any;
}

const MarketStatsNav: React.FC<PageProps> = React.memo((props) => {
  const {
    leftNavResult,
    type,
    subType,
    firstOperand,
    operationType,
    secondOperand,
    shortUrlMapping,
  } = props;
  const toggleL2Menu = (e: any) => {
    try {
      e.stopPropagation();
      const elm = e.currentTarget;
      if (elm.classList.contains(styles["collapsed"])) {
        const navExpandedAll = document.querySelectorAll(
          `.${styles["expanded"]}`,
        );
        navExpandedAll.forEach((item: any) => {
          item.classList.remove(styles["expanded"]);
          item.classList.add(styles["collapsed"]);
          const caret = item.getElementsByClassName(styles["caret"]);
          caret[0].classList.remove("eticon_caret_up");
          caret[0].classList.add("eticon_caret_down");
        });
        elm.classList.remove(styles["collapsed"]);
        elm.classList.add(styles["expanded"]);
        const caret = elm.getElementsByClassName(styles["caret"]);
        caret[0].classList.remove("eticon_caret_down");
        caret[0].classList.add("eticon_caret_up");
      } else {
        elm.classList.remove(styles["expanded"]);
        elm.classList.add(styles["collapsed"]);
        const caret = elm.getElementsByClassName(styles["caret"]);
        caret[0].classList.remove("eticon_caret_up");
        caret[0].classList.add("eticon_caret_down");
      }
    } catch (e) {
      console.log("Error toggleL2Menu: ", e);
    }
  };

  const handleClick = (e: any) => {
    const elm = e.currentTarget;
    const nav = document.querySelectorAll(`.${styles["subNavWrapLi"]}`);
    nav.forEach((item) => {
      item.classList.remove(styles["active"]);
    });
    elm.classList.add(styles["active"]);
  };

  const renderLink = (subItem: any) => {
    const isExist: any = shortUrlMapping.find(
      (item: any) => item.longURL == subItem.link,
    );
    const linkHref = isExist ? isExist.shortUrl : subItem.link;
    return <Link href={linkHref}>{subItem.label}</Link>;
  };

  return (
    <>
      <div className={`${styles.navWrap} customScroll`}>
        {leftNavResult &&
          leftNavResult.nav.map((item: any, index: number) => {
            return (
              <Fragment key={index}>
                <div
                  className={`${styles.navWrapLi} ${item.type == type ? styles.expanded : styles.collapsed}`}
                  onClick={(e) => {
                    item.sub_nav && toggleL2Menu(e);
                  }}
                >
                  {item.sub_nav && item.sub_nav.length > 0 && (
                    <span
                      className={`${index == 0 ? "eticon_caret_up" : "eticon_caret_down"} ${styles.caret}`}
                    ></span>
                  )}
                  <span className={styles.labelName}>{item.label}</span>
                </div>
                {item.sub_nav && (
                  <ul className={styles.subNavWrap}>
                    {item.sub_nav.map((subItem: any, subNavindex: any) => (
                      <li
                        key={`${index}_${subNavindex}`}
                        className={`${styles.subNavWrapLi} ${(!!subType && subType == subItem.type) || (!!firstOperand && !!operationType && !!secondOperand && firstOperand == subItem.firstoperand && operationType == subItem.operationtype && secondOperand == subItem.secondoperand) ? styles.active : ""}`}
                        onClick={(e) => handleClick(e)}
                      >
                        {renderLink(subItem)}
                      </li>
                    ))}
                  </ul>
                )}
              </Fragment>
            );
          })}
      </div>
    </>
  );
});
MarketStatsNav.displayName = "MarketStatsNav";
export default MarketStatsNav;
