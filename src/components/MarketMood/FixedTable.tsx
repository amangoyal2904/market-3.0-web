import styles from "./MarketMood.module.scss";

const FixedTableMarketMood = ({
  tableData = null,
  widget = "overview",
}: any) => {
  return (
    <div id="fixedTable" className={styles.fixedWrapper}>
      <table className={styles.marketsCustomTable}>
        <thead id="thead">
          <tr className={styles.leftThWrapper}>
            <th>Date</th>
            <th>Price</th>
            <th>Chg%</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item: any, index: number) => {
            return (
              <tr key={index}>
                <td>{item.dateStr}</td>
                <td>{item.indexPrice}</td>
                <td>-</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FixedTableMarketMood;
