"use client";
import React, { useEffect, useState } from "react";
import styles from "./MarketStatsNav.module.scss";
import Link from "next/link";
import MarketStatsSubNav from "./MarketStatsSubNav";
interface PageProps {
  leftNavResult: any;
}

const MarketStatsNav: React.FC<PageProps> = (props) => {
  const { leftNavResult } = props;
  console.log("leftNavResult", leftNavResult.nav);
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
        });
        elm.classList.remove(styles["collapsed"]);
        elm.classList.add(styles["expanded"]);
        // const navAll = document.querySelectorAll(`.${styles["subNavWrapLi"]}`);
        // navAll.forEach((item:any)=>{
        //     item.classList.remove(styles["active"]);
        // })
        // const parentElem = e.target.parentNode;
        // const nav = parentElem.nextElementSibling.querySelectorAll(`.${styles["subNavWrapLi"]}`);
        // nav[0].classList.add(styles["active"]);
      } else {
        elm.classList.remove(styles["expanded"]);
        elm.classList.add(styles["collapsed"]);
        // const nav = document.querySelectorAll(`.${styles["subNavWrapLi"]}`);
        // nav.forEach((item)=>{
        //     item.classList.remove(styles["active"]);
        // })
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
              <>
                <div
                  key={item.id}
                  className={`${styles.navWrapLi} ${index == 0 ? styles.expanded : styles.collapsed}`}
                  onClick={(e) => {
                    item.sub_nav && toggleL2Menu(e);
                  }}
                >
                  {/* <li
                        key={item.id}
                        className={`${styles.navWrapLi} ${
                        expandedItems.includes(index) ? styles.expanded : styles.collapsed
                        }`}
                        onClick={() => item.sub_nav && toggleSubMenu(index)}
                    > */}
                  {item.sub_nav && item.sub_nav.length > 0 && (
                    <span
                      className={`eticon_caret_up ${styles.caret_up}`}
                    ></span>
                  )}
                  <span className={styles.labelName}>{item.label}</span>
                </div>
                {item.sub_nav && (
                  <ul className={styles.subNavWrap}>
                    {item.sub_nav.map((subItem: any, index: any) => (
                      <li
                        key={subItem.id}
                        className={`${styles.subNavWrapLi}`}
                        onClick={(e) => handleClick(e)}
                      >
                        {/* className={`${index == 0 ? styles.active : ""}`} */}
                        <Link href={subItem.link}>{subItem.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            );
          })}
      </div>
    </>
  );
};

export default MarketStatsNav;
