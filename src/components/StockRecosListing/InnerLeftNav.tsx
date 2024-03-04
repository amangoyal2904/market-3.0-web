"use client";

import Link from "next/link";
import styles from "./styles.module.scss";
import React from "react";

const InnerLeftNav = (props: any) => {
  const { recosNavResult } = props;

  const handleTabClick = (e: any) => {
    const elm = e.target.parentNode;
    if (elm.classList.contains(styles["collapsed"])) {
      elm.classList.remove(styles["collapsed"]);
      //elm.classList.add(styles["l2Expanded"]);
    } else {
      //elm.classList.remove(styles["l2Expanded"]);
      elm.classList.add(styles["collapsed"]);
    }
  };

  return (
    <>
      <div className={styles.leftNavWrap}>
        <div className={styles.categoryWrap}>
          <h3 className={styles.headName}>Category</h3>
          <div className={styles.categoryListWap}>
            {recosNavResult?.tabs.map((value: any, index: any) => {
              return (
                <>
                  {value.label != "Overview" && (
                    <React.Fragment key={`recosNavResult_${index}`}>
                      {value.ss ? (
                        <div className={styles.categoryList}>
                          <div
                            className={`${styles.categoryListTab}`}
                            onClick={(e) => handleTabClick(e)}
                          >
                            <span className="eticon_caret_down"></span>
                            {/* <Link href={`/stocksrecos/${value.apiType}`}>{value.label}</Link> */}
                            <span>{value.label}</span>
                          </div>
                          <ul className={styles.categoryInnerListWrap}>
                            {value?.ss?.map((ssValue: any, ssIndex: any) => {
                              return (
                                <li
                                  className={styles.categoryInnerList}
                                  key={`leftNavWrap_${value.apiType}_${ssIndex}`}
                                >
                                  <Link
                                    href={`/stocksrecos/${value.apiType}/${ssValue.recoType}`}
                                  >
                                    {ssValue.label}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ) : (
                        <div
                          className={`${styles.categoryList} ${styles.catLink}`}
                        >
                          <Link href={`/stocksrecos/${value.apiType}`}>
                            {value.label}
                          </Link>
                        </div>
                      )}
                    </React.Fragment>
                  )}
                </>
              );
            })}
          </div>
        </div>
        <div className={styles.brokeringWrap}>
          <h3 className={styles.headName}>Brokering House</h3>
          <ul className={styles.innerList}>
            <li className={styles.brokeringList}>
              <div className={styles.forGroup}>
                <input
                  id="1351"
                  type="checkbox"
                  className={styles.checkBoxSec}
                />
                <label htmlFor="1351">
                  <span className={styles.checkBoxStyle}></span>
                  <span className={styles.labelText}>Prabhudas Lilladher</span>
                </label>
              </div>
            </li>
            <li className={styles.brokeringList}>
              <div className={styles.forGroup}>
                <input
                  id="1352"
                  type="checkbox"
                  className={styles.checkBoxSec}
                />
                <label htmlFor="1352">
                  <span className={styles.checkBoxStyle}></span>
                  <span className={styles.labelText}>Prabhudas Lilladher</span>
                </label>
              </div>
            </li>
          </ul>
        </div>
        <div className={styles.searchWrap}>
          <h3 className={styles.headName}>Search</h3>
          <div className={styles.searchBoxWap}>
            <div className={styles.searchBox}>
              <span className="eticon_search"></span>
              <input
                type="text"
                placeholder="Search Stock Recos"
                className={styles.recosSearchInput}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InnerLeftNav;
