import styles from "./MarketMood.module.scss";

const FixedTableMarketMood = ({ tableData = null }: any) => {
  return (
    <div id="fixedTable" className={styles.fixedWrapper}>
      <table className={styles.marketsCustomTable}>
        <thead id="thead">
          <tr className={styles.leftThWrapper}>
            <th className={styles.firstTh}>Date</th>
            <th>Price</th>
            <th>Chg%</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item: any, index: number) => {
            return (
              <tr key={index}>
                <td>{item.date}</td>
                <td className="numberFonts">{item.indexPrice}</td>
                <td className={`${item.trend} numberFonts`}>
                  {item.percentChange}{" "}
                  {item.trend && (
                    <span
                      className={`${styles.arrowIcons} ${
                        item.trend == "up"
                          ? "eticon_up_arrow"
                          : item.trend == "down"
                            ? "eticon_down_arrow"
                            : ""
                      }`}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FixedTableMarketMood;
