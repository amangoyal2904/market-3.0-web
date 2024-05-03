import styles from "./Indices.module.scss";
interface Props {
  item: any;
  index: number;
  onSelectIndex: any;
  selectedIndex: any;
}

const StockCards: React.FC<Props> = ({
  item,
  index,
  onSelectIndex,
  selectedIndex,
}) => {
  return (
    <div
      key={`indicesTab${index}`}
      className={`${styles.cards} ${item.indexName == selectedIndex.indexName ? styles.tabActive : ""}`}
      onClick={() => onSelectIndex(item)}
    >
      <p className={styles.indexName}>{item.indexName}</p>
      <p className={styles.indexPrice}>{item.currentIndexValue}</p>
      <p
        className={`${item.netChange > 0 ? styles.up : item.netChange < 0 ? styles.down : ""} ${styles.indexChange}`}
      >
        {item?.netChange?.replace("-", "")} (
        {item?.percentChange?.replace("-", "")}%)
        <span
          className={`${styles.arrowIcons} ${
            item.netChange > 0
              ? `${styles.up} eticon_up_arrow`
              : item.netChange < 0
                ? `${styles.down} eticon_down_arrow`
                : ""
          }`}
        />
      </p>
    </div>
  );
};
export default StockCards;
