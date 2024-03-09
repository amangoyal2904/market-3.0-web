import styles from "./MarketMoodComponents.module.scss";

const ScrollableTableMarketMood = ({ tableHeader, tableData, type }: any) => {
  return (
    <div id="scrollableTable" className={styles.scrollableWrapper}>
      <table className={styles.marketsCustomTable}>
        <thead>
          <tr>
            {tableHeader.map((item: any, index: number) => (
              <th key={index}>{item.replace(/\n/g, " ")}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((data: any, index: number) => (
            <tr key={index}>
              {data.dataList.map((item: any, itemIndex: number) => (
                <td key={itemIndex} className={styles.withTiles}>
                  <span className={`${styles[item.color]} ${styles.tiles}`}>
                    {type == "count" ? item.count : item.percent + "%"}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScrollableTableMarketMood;
