import React, { useState } from "react";
import styles from "./Search.module.scss";
import { formatDate, makeBold } from "@/utils";
import { getStockUrl } from "@/utils/utility";

interface Props {
  item: any;
  entity: string;
  count: number;
  query: string;
}

const SearchDataLi: React.FC<Props> = ({ item, entity, count, query }) => {
  const sanitizeData = (str: string) => {
    return makeBold(query, str);
  };
  const handleScrollClick = (scrollOffSet: string, url: string) => {
    //console.log("scrollOffSet",scrollOffSet,url)
    window.localStorage.setItem("windowScrollId", scrollOffSet);
    window.open(url, "_blank");
  };
  return (
    <>
      <li className={styles.head}>{entity == "INDEX" ? "INDICES" : entity}</li>
      {item.map(
        (item: any, index: number) =>
          index < count - 1 && (
            <li key={index} className={styles.searchliComp}>
              <a
                href={getStockUrl(
                  item.tagId,
                  item.tagSeoName,
                  item.entityType,
                  item.subType,
                  item.fromCurrencyShort ? item.fromCurrencyShort : "",
                  item.toCurrencyShort ? item.toCurrencyShort : "",
                  item.fno ? item.fno : "",
                )}
                title={item.tagName}
                target={entity === "INDEX" ? "_self" : "_blank"}
              >
                <div className={styles.st_row}>
                  {entity == "NPS" ? (
                    <div
                      className={styles.st_col}
                      dangerouslySetInnerHTML={{
                        __html: sanitizeData(
                          `${item.tagName} - ${item.SchemeName1} -${item.SchemeName2}`,
                        ),
                      }}
                    ></div>
                  ) : (
                    <div
                      className={styles.st_col}
                      dangerouslySetInnerHTML={{
                        __html: makeBold(query, item.tagName),
                      }}
                    ></div>
                  )}
                  {item.lastTradedPrice && (
                    <div
                      className={`numberFonts ${styles.st_col} ${styles.st_change} ${Number(item.NetChange) > 0 ? "green" : "red"} ${styles.st_mid_col}`}
                    >
                      {item.lastTradedPrice}
                    </div>
                  )}
                  {item.NetChange && (
                    <div
                      className={`numberFonts ${styles.st_col} ${Number(item.NetChange) > 0 ? "green" : "red"}`}
                    >
                      {item.NetChange}
                    </div>
                  )}
                </div>
                {item.percentChange && (
                  <div className={`${styles.st_row} ${styles.st_last}`}>
                    {item.DateTime && (
                      <div className={styles.st_col}>
                        {formatDate(item.DateTime)}
                      </div>
                    )}
                    {item.volume && (
                      <div className={`${styles.st_col} ${styles.st_mid_col}`}>
                        Vol.{" "}
                        <span className="numberFonts">
                          {parseFloat((Number(item.volume) / 1000).toFixed(2))}
                        </span>
                        k
                      </div>
                    )}
                    {item.percentChange && (
                      <div
                        className={`numberFonts ${styles.st_col} ${Number(item.NetChange) > 0 ? "green" : "red"}`}
                      >
                        {item.percentChange}%
                      </div>
                    )}
                  </div>
                )}
              </a>
            </li>
          ),
      )}
    </>
  );
};

export default SearchDataLi;
