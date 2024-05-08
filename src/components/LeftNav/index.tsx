"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { trackingEvent } from "@/utils/ga";
import GLOBAL_CONFIG from "../../network/global_config.json";

const LeftNav = (props: any) => {
  const { leftNavResult = {} } = props;
  const { markets = {}, markets_pro = {} } = leftNavResult;
  const [isExpanded, setIsExpanded] = useState(true);
  const [isL2Expanded, setIsL2Expanded] = useState(false);
  const [isAutoCollapsed, setAutoCollapsed] = useState(
    (GLOBAL_CONFIG as any)["NAV_CONFIG"]["Auto_Collapsed"],
  );
  const pathname = usePathname();
  const timerVal = Number(
    (GLOBAL_CONFIG as any)["NAV_CONFIG"]["Collapsed_Time"],
  );
  const [timeoutRef, setTimeoutRef] = useState<any>(null);

  const toggleMenu = () => {
    if (isAutoCollapsed) {
      clearTimeout(timeoutRef);
      setAutoCollapsed(false);
    }
    setIsExpanded(!isExpanded);
    setIsL2Expanded(!isL2Expanded);
  };

  useEffect(() => {
    console.log("isExpanded-----", isExpanded);
    if (isExpanded) {
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "lhsmenu_click",
        event_label: "lhsmenu_expand",
      });
    } else {
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "lhsmenu_click",
        event_label: "lhsmenu_collapse",
      });
    }
  }, [isExpanded]);

  useEffect(() => {
    console.log("isAutoCollapsed --- ", isAutoCollapsed);
    let timerRef = null;
    if (isAutoCollapsed) {
      timerRef = setTimeout(function () {
        console.log("isAutoCollapsed --3- ", isAutoCollapsed);
        toggleMenu();
      }, timerVal * 1000);

      setTimeoutRef(timerRef);
    }

    //return () => clearTimeout(timerRef);
  }, []);

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

  const navClickTrackingHandle = (navList: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "lhsmenu_click",
      event_label: navList.l2 || navList.l1,
      selected_category: navList.l1,
    });
  };

  const navSchemaItemListElements: any[] = [];
  const navSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: navSchemaItemListElements,
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
              navSchemaItemListElements.push({
                "@type": "ListItem",
                position: index + 1,
                name: value.label,
                item: value.link,
              });

              return (
                <li
                  className={`${styles.navListWrap} ${!isExpanded ? styles.l2Collapsed : ""}`}
                  key={`market_nav_${index}`}
                >
                  {value.link ? (
                    <Link
                      href={value.link}
                      onClick={() =>
                        navClickTrackingHandle({ l1: value.label, l2: "" })
                      }
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
                              <Link
                                href={sec.link}
                                onClick={() =>
                                  navClickTrackingHandle({
                                    l1: value.label,
                                    l2: sec.label,
                                  })
                                }
                              >
                                {sec.label}
                              </Link>
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
                      onClick={() =>
                        navClickTrackingHandle({ l1: value.label, l2: "" })
                      }
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(navSchema),
        }}
      />
    </div>
  );
};

export default LeftNav;
