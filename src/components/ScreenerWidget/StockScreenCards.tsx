import React from "react";
import styles from "./styles.module.scss";
import Link from "next/link";

interface itemType {
  collectionId: string;
  listScreenerMaster: any[];
  collectionDescription: string;
  collectionName: string;
}

interface Props {
  item: itemType;
  index: number;
}

const StockScreenCards: React.FC<Props> = ({ item, index }) => {
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
                  className={`${index > 3 ? styles.hidden : ""}`}
                >
                  <Link
                    href={`/markets/stock-screener/${
                      screen.seoName ? screen.seoName : "test-seo-page"
                    }/screens/scrid-${screen.screenerId}`}
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
                  </Link>
                </li>
              );
            })
          : ""}
      </ul>
    </div>
  );
};

export default StockScreenCards;
