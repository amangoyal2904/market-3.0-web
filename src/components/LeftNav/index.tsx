import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Service from "../../network/service";
import { usePathname } from "next/navigation";
import Link from "next/link";

const LeftNav = (props: any) => {
  console.log("props-----", props.leftNavResult);
  const { leftNavResult } = props;
  const { markets, markets_pro } = leftNavResult;
  const [isExpanded, setIsExpanded] = useState(true);
  const [isL2Expanded, setIsL2Expanded] = useState(false);
  const pathname = usePathname();

  console.log("pathname---", pathname);

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

  return (
    <div
      className={`${styles.navWrap} ${isExpanded ? styles.expanded : styles.collapsed}`}
    >
      <div className={styles.toggleMenuWrap} onClick={toggleMenu}>
        <span
          className={`${styles.toggleMenu} ${isExpanded ? "eticon_prev" : "eticon_next"}`}
        ></span>
      </div>
      <div>
        <ul className={styles.marketNavWrap}>
          {markets?.nav.map((value: any, index: any) => {
            return (
              <li
                className={`${styles.navListWrap} ${styles.l2Collapsed}`}
                key={`market_nav_${index}`}
              >
                {value.link ? (
                  <Link href={value.link} className={styles.mainTabWrap}>
                    <span className={`${value.icon} ${styles.navIcon}`}></span>
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
                    <ul className={styles.l2ListWrap}>
                      <li className={`${styles.l2ListWrapName}`}>
                        {value.label}
                      </li>
                      {value?.sec.map((sec: any, index: number) => {
                        return (
                          <>
                            <li
                              className={`${styles.l2List} ${pathname == sec.link ? styles.active : ""}`}
                              key={`l2_label_${index}`}
                            >
                              <Link href={sec.link}>{sec.label}</Link>
                            </li>
                          </>
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
            {isExpanded ? markets_pro.heading : "PRO"}
          </h3>
          <ul>
            {markets_pro?.nav.map((value: any, index: any) => {
              return (
                <li
                  className={styles.navListWrap}
                  key={`market_pro_nav_${index}`}
                >
                  <Link href={value.link} className={styles.mainTabWrap}>
                    <span className={`${value.icon} ${styles.navIcon}`}></span>
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
  );
};

export default LeftNav;
