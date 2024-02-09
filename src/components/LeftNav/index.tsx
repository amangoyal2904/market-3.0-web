import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Service from "../../network/service";

const LeftNav = (props: any) => {
  console.log("props-----", props.leftNavResult);
  const { leftNavResult } = props;
  const { markets, markets_pro } = leftNavResult;
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
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
        <ul>
          {markets?.nav.map((value: any, index: any) => {
            return (
              <li className={styles.navListWrap} key={`market_nav_${index}`}>
                {value.link ? (
                  <a href={value.link} className={styles.mainTabWrap}>
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
                  </a>
                ) : (
                  <div className={styles.mainTabWrap}>
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
                  </div>
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
                  <a href={value.link} className={styles.mainTabWrap}>
                    <span className={`${value.icon} ${styles.navIcon}`}></span>
                    <span
                      className={`${!isExpanded ? styles.hide : ""} ${styles.l1LabelName}`}
                    >
                      {value.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default LeftNav;
