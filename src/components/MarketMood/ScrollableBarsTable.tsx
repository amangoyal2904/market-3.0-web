import styles from "./MarketMood.module.scss";

const ScrollableBarsTableMarketMood = ({
  tableHeader,
  tableData,
  type,
}: any) => {
  return (
    <div id="scrollableTable" className={styles.scrollableWrapper}>
      <table className={styles.marketsCustomTable}>
        <thead>
          <tr>
            <th colSpan={4}>daf</th>
            <th className={styles.noData}></th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data: any, index: number) => (
            <tr key={index}>
              <td colSpan={4}>dfds</td>
              <td className={styles.noData}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScrollableBarsTableMarketMood;
