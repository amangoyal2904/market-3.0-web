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
  return (
    <div
      key={`indicesTab${index}`}
      className={`${styles.cards} ${item.indexName == selectedIndex.indexName ? styles.tabActive : ""}`}
      onClick={() => onSelectIndex(item)}
    >
      <p className={styles.indexName}>{item.indexName}</p>
      <p className={`numberFonts ${styles.indexPrice}`}>
        {item.lastTradedPrice}
      </p>
      <p
        className={`numberFonts ${item[changePeriod] > 0 ? styles.up : item[changePeriod] < 0 ? styles.down : ""} ${styles.indexChange}`}
      >
        {Math.abs(item[changePeriod])}&nbsp;({Math.abs(item[percentChange])}%)
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
