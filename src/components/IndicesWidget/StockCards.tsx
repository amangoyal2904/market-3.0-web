import { useState, useEffect, useRef } from "react";
import { formatNumber } from "@/utils";
import styles from "./Indices.module.scss";

interface Props {
  item: any;
  index: number;
  onSelectIndex: any;
  selectedIndex: any;
  changePeriod: string;
  percentChange: string;
}

const StockCards: React.FC<Props> = ({
  item,
  index,
  onSelectIndex,
  selectedIndex,
  changePeriod,
  percentChange,
}) => {
  const prevStockCardRef = useRef<any>([]);
  useEffect(() => {
    prevStockCardRef.current = item;
    const timer = setTimeout(() => {
      const highlightBgElements = document.querySelectorAll(".highlightBg");
      highlightBgElements.forEach((elem) => {
        elem.classList.remove("upBg", "downBg");
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [item]);

  const prevStockCard = prevStockCardRef.current;

  return (
    <div
      key={`indicesTab${index}`}
      className={`${styles.cards} ${item.indexName === selectedIndex.indexName ? styles.tabActive : ""}`}
      onClick={() => onSelectIndex(item)}
    >
      <p className={styles.indexName}>{item.indexName}</p>
      <p
        className={`numberFonts highlightBg ${styles.indexPrice} ${
          prevStockCard?.lastTradedPrice
            ? parseFloat(item.lastTradedPrice) >
              parseFloat(prevStockCard?.lastTradedPrice)
              ? "upBg"
              : parseFloat(item.lastTradedPrice) <
                  parseFloat(prevStockCard?.lastTradedPrice)
                ? "downBg"
                : ""
            : ""
        }`}
      >
        {formatNumber(item.lastTradedPrice)}
      </p>
      <p
        className={`numberFonts ${item[changePeriod] > 0 ? styles.up : item[changePeriod] < 0 ? styles.down : ""} ${styles.indexChange}`}
      >
        {Math.abs(item[changePeriod]).toFixed(2)}&nbsp;(
        {item[percentChange].toFixed(2)}%)
        <span
          className={`${styles.arrowIcons} ${
            item[changePeriod] > 0
              ? `${styles.up} eticon_up_arrow`
              : item[changePeriod] < 0
                ? `${styles.down} eticon_down_arrow`
                : ""
          }`}
        />
      </p>
    </div>
  );
};

export default StockCards;
