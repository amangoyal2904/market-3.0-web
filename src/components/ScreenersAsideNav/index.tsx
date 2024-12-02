"use client";
import React, { Fragment } from "react";
import styles from "./Screeners.module.scss";
import Link from "next/link";
import { trackingEvent } from "@/utils/ga";
interface PageProps {
  leftNavResult: any;
  activeId: any;
  l3UserNav?: any;
}

const StocksScreenerNav: React.FC<PageProps> = (props) => {
  const { leftNavResult, activeId, l3UserNav } = props;
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
  const gaLinkforL3Menu = (lable: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "L3_nav_click",
      event_label: lable,
    });
  };
  const renderLink = (subItem: any, l3lableName: string) => {
    const linkHref = `/markets/stock-screener/${subItem.seoName ? subItem.seoName : "test-seo-page"}/screens/scrid-${subItem.screenerId}`;
    return (
      <Link
        title={subItem.name}
        href={linkHref}
        onClick={() => gaLinkforL3Menu(`${l3lableName} - ${subItem.name}`)}
      >
        {subItem.name}
      </Link>
    );
  };
  return (
    <>
      <div className={`customScroll ${styles.navWrap}`}>
        {l3UserNav &&
        l3UserNav.listScreenerMaster &&
        l3UserNav.listScreenerMaster.length > 0 ? (
          <>
            <div
              className={`${styles.navWrapLi} ${l3UserNav.listScreenerMaster.some((obj: any) => obj.screenerId == activeId) ? styles.expanded : styles.collapsed}`}
              onClick={(e) => {
                l3UserNav.listScreenerMaster && toggleL2Menu(e);
              }}
            >
              <span className={`eticon_caret_up ${styles.caret}`}></span>
              <span className={styles.labelName}>
                {l3UserNav.collectionName}
              </span>
            </div>
            <ul className={styles.subNavWrap}>
              {l3UserNav.listScreenerMaster.map((item: any, index: any) => {
                return (
                  <li
                    key={`${item.screenerId}-${index}-subLi`}
                    id={item.screenerId}
                    className={`${styles.subNavWrapLi} ${activeId == item.screenerId ? styles.active : null}`}
                  >
                    {renderLink(item, item.collectionName)}
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          ""
        )}

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
                      >
                        {renderLink(subItem, item.collectionName)}
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
