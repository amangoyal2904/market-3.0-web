"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./styles.module.scss";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { trackingEvent } from "@/utils/ga";
import GLOBAL_CONFIG from "../../network/global_config.json";
import { renderIconPaths } from "@/utils/iconUtils";

const LeftNav = ({ leftNavResult = {} }: any) => {
  const { markets = {}, markets_pro = {} } = leftNavResult;
  const [isLoadExpand, setIsLoadExpand] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isL2Expanded, setIsL2Expanded] = useState(false);
  const [isAutoCollapsed, setAutoCollapsed] = useState(
    GLOBAL_CONFIG.NAV_CONFIG.Auto_Collapsed,
  );
  const pathname = usePathname();
  const timerVal = Number(GLOBAL_CONFIG.NAV_CONFIG.Collapsed_Time);

  const toggleMenu = useCallback(() => {
    if (isAutoCollapsed) {
      setAutoCollapsed(false);
    }
    setIsExpanded((prev) => !prev);
    setIsL2Expanded((prev) => !prev);
  }, [isAutoCollapsed]);

  useEffect(() => {
    if (isLoadExpand) {
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "lhsmenu_click",
        event_label: isExpanded ? "lhsmenu_expand" : "lhsmenu_collapse",
      });
    }
  }, [isExpanded, isLoadExpand]);

  useEffect(() => {
    if (isAutoCollapsed) {
      const timerRef = setTimeout(toggleMenu, timerVal * 1000);
      return () => clearTimeout(timerRef);
    }
  }, [isAutoCollapsed, timerVal, toggleMenu]);

  const toggleL2Menu = useCallback((e: any) => {
    const elm = e.currentTarget.closest(`.${styles.navListWrap}`);
    elm?.classList.toggle(styles.l2Collapsed);
    elm?.classList.toggle(styles.l2Expanded);
  }, []);

  const handleMainHover = useCallback(() => {
    const element = document.querySelector(`.${styles.navWrap}`);
    let hoverTimeout: NodeJS.Timeout;

    const handleMouseEnter = () => {
      hoverTimeout = setTimeout(() => {
        element?.classList.add(styles.hovered);
      }, 200);
    };

    const handleMouseLeave = () => {
      clearTimeout(hoverTimeout);
      element?.classList.remove(styles.hovered);
    };

    element?.addEventListener("mouseenter", handleMouseEnter);
    element?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element?.removeEventListener("mouseenter", handleMouseEnter);
      element?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    handleMainHover();
  }, [handleMainHover]);

  const hasUrlSelect = useCallback(
    (str: string) => pathname.includes(str),
    [pathname],
  );

  const navClickTrackingHandle = useCallback((navList: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "lhsmenu_click",
      event_label: navList.l2 || navList.l1,
      selected_category: navList.l1,
    });
  }, []);

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
      <div
        className={styles.navInnerWrap}
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
        role="menu"
        aria-labelledby="menubutton"
      >
        <div className={styles.toggleMenuWrap}>
          <span
            className={`${styles.toggleMenu} eticon_hamburger`}
            onClick={() => {
              setIsLoadExpand(true);
              toggleMenu();
            }}
          ></span>
        </div>
        <div
          className={styles.navOptWrap}
          role="menu"
          aria-labelledby="menubutton"
        >
          <ul className={styles.marketNavWrap} role="group">
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
                  role="presentation"
                >
                  {value.link ? (
                    <Link
                      title={value.label}
                      href={value.link}
                      target={value?.newTab ? "_blank" : "_self"}
                      onClick={() =>
                        navClickTrackingHandle({ l1: value.label, l2: "" })
                      }
                      className={`${styles.mainTabWrap} ${hasUrlSelect(value.matchPattern) ? styles.active : ""}`}
                      role="menuitem"
                    >
                      <span className={`${value.icon} ${styles.navIcon}`}>
                        {renderIconPaths(value.icon)}
                      </span>
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
                        onClick={(e) => value.sec && toggleL2Menu(e)}
                      >
                        <span className={`${value.icon} ${styles.navIcon}`}>
                          {renderIconPaths(value.icon)}
                        </span>
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
                      {value.sec && (
                        <ul className={styles.l2ListWrap} role="group">
                          {value.sec.map((sec: any, secIndex: number) => (
                            <li
                              className={`${styles.l2List} ${hasUrlSelect(sec.matchPattern) ? styles.active : ""}`}
                              key={`l2_label_${secIndex}`}
                              role="presentation"
                            >
                              <Link
                                title={sec.label}
                                href={sec.link}
                                target={sec?.newTab ? "_blank" : "_self"}
                                onClick={() =>
                                  navClickTrackingHandle({
                                    l1: value.label,
                                    l2: sec.label,
                                  })
                                }
                                role="menuitem"
                                itemProp="url"
                              >
                                <meta itemProp="name" content={sec.label} />
                                {sec.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          <div className={styles.marketProWrap}>
            <h3 className={styles.proHeading} role="presentation">
              <span className={styles.expandTitle}>
                <span className="eticon_prime_logo">
                  {renderIconPaths("eticon_prime_logo")}
                </span>
                <span className={styles.etprimeLogoText}>ETPrime</span>
              </span>
              <span className={styles.collapsedTitle}>
                <span className="eticon_prime_logo">
                  {renderIconPaths("eticon_prime_logo")}
                </span>
              </span>
            </h3>
            <ul role="group">
              {markets_pro?.nav?.map((value: any, index: any) => (
                <li
                  className={styles.navListWrap}
                  key={`market_pro_nav_${index}`}
                  role="presentation"
                >
                  <Link
                    href={value.link}
                    title={value.label}
                    target={value?.newTab ? "_blank" : "_self"}
                    onClick={() =>
                      navClickTrackingHandle({ l1: value.label, l2: "" })
                    }
                    itemProp="url"
                    className={`${styles.mainTabWrap} ${hasUrlSelect(value.matchPattern) ? styles.active : ""}`}
                    role="menuitem"
                  >
                    <meta itemProp="name" content={value.label} />
                    <span className={`${value.icon} ${styles.navIcon}`}>
                      {renderIconPaths(value.icon)}
                    </span>
                    <span
                      className={`${!isExpanded ? styles.hide : ""} ${styles.l1LabelName}`}
                    >
                      {value.label}
                    </span>
                  </Link>
                </li>
              ))}
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
