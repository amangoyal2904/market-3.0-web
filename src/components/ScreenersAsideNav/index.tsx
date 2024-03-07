"use client";
import React, { Fragment } from "react";
import styles from "./Screeners.module.scss";
import Link from "next/link";

interface PageProps {
  leftNavResult: any;
  activeId: any;
}

const StocksScreenerNav: React.FC<PageProps> = (props) => {
  const { leftNavResult, activeId } = props;

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
    const linkHref = `/markets/stock-screener/${subItem.seoName ? subItem.seoName : "test-seo-page"}/screens/scrid-${subItem.screenerId}`;
    return <Link href={linkHref}>{subItem.name}</Link>;
  };
  return (
    <>
      <div className={`customeScroll ${styles.navWrap}`}>
        {leftNavResult &&
          leftNavResult.map((item: any, index: number) => {
            return (
              <Fragment key={`${item.screenerId}-${index}-ul`}>
                <div
                  className={`${styles.navWrapLi} ${item.listScreenerMaster.some((obj: any) => obj.screenerId == activeId) ? styles.expanded : styles.collapsed}`}
                  onClick={(e) => {
                    item.listScreenerMaster && toggleL2Menu(e);
                  }}
                >
                  {item.listScreenerMaster &&
                    item.listScreenerMaster.length > 0 && (
                      <span
                        className={`${index == 0 ? "eticon_caret_up" : "eticon_caret_down"} ${styles.caret}`}
                      ></span>
                    )}
                  <span className={styles.labelName}>
                    {item.collectionName}
                  </span>
                </div>
                {item.listScreenerMaster && (
                  <ul className={styles.subNavWrap}>
                    {item.listScreenerMaster.map((subItem: any, index: any) => (
                      <li
                        key={`${subItem.screenerId}-${index}-subLi`}
                        id={subItem.screenerId}
                        className={`${styles.subNavWrapLi} ${activeId == subItem.screenerId ? styles.active : null}`}
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
};

export default StocksScreenerNav;
