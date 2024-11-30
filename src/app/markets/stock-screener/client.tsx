"use client";
import { useState } from "react";
import styles from "./style.module.scss";

const StockScreenerPage = ({ data }: any) => {
  const defaultStocksData: any =
    data &&
    data.datainfo &&
    data.datainfo.screenerCollectionMasterInfo &&
    data.datainfo.screenerCollectionMasterInfo
      .listScreenerCollectionMasterDataInfo &&
    data.datainfo.screenerCollectionMasterInfo
      .listScreenerCollectionMasterDataInfo.length > 0
      ? data.datainfo.screenerCollectionMasterInfo
          .listScreenerCollectionMasterDataInfo
      : [];
  const [stockData, setStockData] = useState(defaultStocksData);
  const [showMoreMap, setShowMoreMap] = useState<{ [key: number]: boolean }>(
    {}
  );

  const toggleShowMore = (index: number) => {
    setShowMoreMap((prevMap) => ({
      ...prevMap,
      [index]: !prevMap[index], // Toggle the show/hide state for the clicked list
    }));
    const section = document.getElementById(`section-${index}`);
    if (showMoreMap[index] && section) {
      const sectionTop =
        section.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: sectionTop, behavior: "smooth" }); // You can change "smooth" to "auto" for instant scrolling
    }
  };
  return (
    <>
      {stockData.map((item: any, index: number) => {
        const showMore = showMoreMap[index] || false;
        return (
          <div
            className={`${styles.list}`}
            key={item.collectionId}
            id={`section-${index}`}
          >
            <h2 className={styles.title}>{item.collectionName}</h2>
            <p className={styles.desc}>{item.collectionDescription}</p>
            <ul>
              {item.listScreenerMaster && item.listScreenerMaster.length > 0
                ? item.listScreenerMaster.map((screen: any, index: number) => {
                    return (
                      <li
                        key={screen.screenerId}
                        className={`${index > 3 && !showMore ? styles.hidden : ""}`}
                      >
                        <a
                          title={screen.name}
                          href={`/markets/stock-screener/${screen.seoName ? screen.seoName : "test-seo-page"}/screens/scrid-${screen.screenerId}`}
                          className={styles.liItemList}
                        >
                          <div className={styles.info}>
                            <h3 className={styles.infoTitle}>{screen.name}</h3>
                            <div className={styles.infoDesc}>
                              {screen.description}
                            </div>
                          </div>
                          <div className={styles.count}>
                            <span className={styles.countTxt}>
                              {screen.resultsCompanyCount}
                            </span>
                            <span>stocks</span>
                          </div>
                        </a>
                      </li>
                    );
                  })
                : ""}
            </ul>
            {item.listScreenerMaster && item.listScreenerMaster.length > 4 ? (
              <div className={styles.viewMoreCta}>
                <span
                  className={`${showMore ? styles.viewMore : styles.viewLess}`}
                  onClick={() => toggleShowMore(index)}
                >
                  {showMore ? "View Less" : "View More"}
                </span>
              </div>
            ) : (
              ""
            )}
          </div>
        );
      })}
    </>
  );
};

export default StockScreenerPage;
