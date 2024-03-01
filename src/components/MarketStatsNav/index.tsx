"use client";
import React, { useState, Fragment } from "react";
import styles from "./MarketStatsNav.module.scss";
import Link from "next/link";

interface PageProps {
  leftNavResult: any;
  type: any;
}

const MarketStatsNav: React.FC<PageProps> = (props) => {
  const { leftNavResult, type } = props;
  // console.log("leftNavResult", leftNavResult.nav);
  const [expandedItems, setExpandedItems] = useState<number[]>([0]);

  // Function to toggle the expansion of submenu for a given index
  const toggleSubMenu = (index: number) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter((item) => item !== index));
    } else {
      setExpandedItems([...expandedItems, index]);
    }
  };
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
          caret[0].classList.remove("eticon_caret_down");
          caret[0].classList.add("eticon_caret_up");
        });
        elm.classList.remove(styles["collapsed"]);
        elm.classList.add(styles["expanded"]);
        const caret = elm.getElementsByClassName(styles["caret"]);
        caret[0].classList.remove("eticon_caret_up");
        caret[0].classList.add("eticon_caret_down");
      } else {
        elm.classList.remove(styles["expanded"]);
        elm.classList.add(styles["collapsed"]);
        const caret = elm.getElementsByClassName(styles["caret"]);
        caret[0].classList.remove("eticon_caret_down");
        caret[0].classList.add("eticon_caret_up");
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

  return (
    <>
      <div className={styles.navWrap}>
        {leftNavResult &&
          leftNavResult.nav.map((item: any, index: number) => {
            return (
              <Fragment key={item.id}>
                <div
                  key={item.id}
                  id={item.id}
                  className={`${styles.navWrapLi} ${item.sub_nav.some((obj: any) => obj.type == type) ? styles.expanded : styles.collapsed}`}
                  onClick={(e) => {
                    item.sub_nav && toggleL2Menu(e);
                  }}
                >
                  {item.sub_nav && item.sub_nav.length > 0 && (
                    <span
                      className={`${index == 0 ? "eticon_caret_down" : "eticon_caret_up"} ${styles.caret}`}
                    ></span>
                  )}
                  <span className={styles.labelName}>{item.label}</span>
                </div>
                {item.sub_nav && (
                  <ul className={styles.subNavWrap}>
                    {item.sub_nav.map((subItem: any, index: any) => (
                      <li
                        key={subItem.id}
                        id={subItem.id}
                        className={`${styles.subNavWrapLi} ${type == subItem.type ? styles.active : null}`}
                        onClick={(e) => handleClick(e)}
                      >
                        {/* className={`${index == 0 ? styles.active : ""}`} */}
                        <Link href={subItem.link}>{subItem.label}</Link>
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

export default MarketStatsNav;
