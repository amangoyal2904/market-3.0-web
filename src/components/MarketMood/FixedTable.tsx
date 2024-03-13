import styles from "./MarketMood.module.scss";

const FixedTableMarketMood = ({
  tableData = null,
  extraHeader = false,
}: any) => {
  return (
    <div id="fixedTable" className={styles.fixedWrapper}>
      <div className={styles.horizontalLine}>
        <span>Daily Performance</span>
      </div>
      <table className={styles.marketsCustomTable}>
        <thead id="thead">
          <tr
            className={`${styles.leftThWrapper} ${extraHeader ? styles.noBottomBorder : ""}`}
          >
            <th className={styles.firstTh}>Date</th>
            <th>Price</th>
            <th>Chg%</th>
          </tr>
          {extraHeader && (
            <tr>
              <th colSpan={3} className={styles.extraCell}></th>
            </tr>
          )}
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
