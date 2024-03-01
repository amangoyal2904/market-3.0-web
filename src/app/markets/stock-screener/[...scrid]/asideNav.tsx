"use client";

import Link from "next/link";
import styles from "./LeftRight.module.scss";
import { useState } from "react";

const AsideNavComponets = ({ data, activeId }: any) => {
  const asideData =
    data &&
    data.datainfo &&
    data.datainfo.screenerCollectionMasterInfo &&
    data.datainfo.screenerCollectionMasterInfo
      .listScreenerCollectionMasterDataInfo
      ? data.datainfo.screenerCollectionMasterInfo
          .listScreenerCollectionMasterDataInfo
      : [];
  const [expandedScreen, setExpandedScreen]: any = useState(null);
  const toggleSubNav = (collectionId: string) => {
    setExpandedScreen(expandedScreen === collectionId ? null : collectionId);
  };
  return (
    <>
      <div className={styles.asideNav}>
        <ul className={styles.mainList}>
          {asideData && asideData.length > 0
            ? asideData.map((screen: any, index: number) => {
                const isChildActive =
                  screen.listScreenerMaster &&
                  screen.listScreenerMaster.some(
                    (item: any) => item.screenerId == activeId,
                  );
                const isActive = isChildActive;
                return (
                  <li
                    key={screen.collectionId}
                    className={`${styles.mainListLi} ${(isActive && !expandedScreen) || expandedScreen == screen.collectionId ? styles.liActive : ""}`}
                    onClick={() => toggleSubNav(screen.collectionId)}
                  >
                    <div className={styles.navTitle}>
                      <span
                        className={`${
                          (isActive && !expandedScreen) ||
                          expandedScreen == screen.collectionId
                            ? "eticon_caret_up"
                            : "eticon_caret_down"
                        } ${styles.up} `}
                      ></span>
                      <span className={styles.scrName}>
                        {screen.collectionName}
                      </span>
                    </div>
                    <ul
                      className={`${styles.subChildNav} ${
                        (isActive && !expandedScreen) ||
                        expandedScreen == screen.collectionId
                          ? styles.expanded
                          : ""
                      }`}
                    >
                      {screen.listScreenerMaster &&
                      screen.listScreenerMaster.length > 0
                        ? screen.listScreenerMaster.map((item: any) => {
                            return (
                              <li
                                key={item.screenerId}
                                className={`${activeId == item.screenerId ? styles.active : ""}`}
                              >
                                <Link
                                  href={`/markets/stock-screener/${item.seoName ? item.seoName : "test-seo-page"}/screens/scrid-${item.screenerId}`}
                                  className={styles.liItemList}
                                >
                                  {item.name}
                                </Link>
                              </li>
                            );
                          })
                        : "<li>No data available</li>"}
                    </ul>
                  </li>
                );
              })
            : "<li>No data available</li>"}
        </ul>
      </div>
    </>
  );
};

export default AsideNavComponets;
