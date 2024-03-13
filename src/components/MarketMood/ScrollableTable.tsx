import styles from "./MarketMood.module.scss";

const ScrollableTableMarketMood = ({ tableHeader, tableData, type }: any) => {
  return (
    <div id="scrollableTable" className={styles.scrollableWrapper}>
      <div className={styles.horizontalLine}>
        <span>No. of Stocks Trading Above</span>
      </div>
      <table className={styles.marketsCustomTable}>
        <thead>
          <tr className={styles.noBottomBorder}>
            {tableHeader.map((item: any, index: number) => (
              <th key={index}>{item.replace(/\n/g, " ")}</th>
            ))}
            <th className={styles.noData}></th>
          </tr>
          <tr>
            <th colSpan={5} className={styles.extraCell}>
              <ul className={styles.legend}>
                <li>
                  <span className={styles.DARK_GREEN}></span>
                  <span className={styles.LIGHT_GREEN}></span> Uptrend
                </li>
                <li>
                  <span className={styles.ORANGE}></span> Neutral
                </li>
                <li>
                  <span className={styles.DARK_RED}></span>
                  <span className={styles.LIGHT_RED}></span> Downtrend
                </li>
              </ul>
            </th>
            <th className={styles.noData}></th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data: any, index: number) => (
            <tr key={index}>
              {data.others.map((item: any, itemIndex: number) => (
                <td key={itemIndex} className={styles.withTiles}>
                  <span className={`${styles[item.color]} ${styles.tiles}`}>
                    {type == "count" ? item.count : item.percent + "%"}
                  </span>
                </td>
              ))}
              <td className={styles.noData}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScrollableTableMarketMood;
