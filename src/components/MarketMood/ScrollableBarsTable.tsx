import styles from "./MarketMood.module.scss";

const ScrollableBarsTableMarketMood = ({ tableData, type }: any) => {
  return (
    <div id="scrollableTable" className={styles.scrollableWrapper}>
      <div className={`${styles.horizontalLine} ${styles.withMaxWidth}`}>
        <span>Showing No. of Stocks</span>
      </div>
      <table className={styles.marketsCustomTable}>
        <thead>
          <tr>
            <th>
              {type == "advanceDecline" ? (
                <ul className={styles.legend}>
                  <li>
                    <span className={styles.up}></span> Advanced
                  </li>
                  <li>
                    <span className={styles.down}></span> Declined
                  </li>
                  <li>
                    <span className={styles.neutralGray}></span> Unchanged
                  </li>
                </ul>
              ) : (
                <ul className={styles.legend}>
                  <li>
                    <span className={styles.down}></span> Low Zone
                  </li>
                  <li>
                    <span className={styles.neutral}></span> Mid Zone
                  </li>
                  <li>
                    <span className={styles.up}></span> High Zone
                  </li>
                </ul>
              )}
            </th>
            <th className={styles.noData}></th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data: any, index: number) => (
            <tr key={index}>
              <td className={styles.withBar}>
                {type == "advanceDecline" ? (
                  <>
                    <div className={styles.bar}>
                      {data.others.up > 0 && (
                        <div
                          className={styles.up}
                          style={{ width: data.others.upChg }}
                        >
                          <span>{data.others.up}</span>
                        </div>
                      )}
                      {data.others.down > 0 && (
                        <div
                          className={styles.down}
                          style={{ width: data.others.downChg }}
                        >
                          <span>{data.others.down}</span>
                        </div>
                      )}
                      {data.others.neutral > 0 && (
                        <div
                          className={styles.neutralGray}
                          style={{ width: data.others.neutralChg }}
                        >
                          <span>{data.others.neutral}</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className={styles.bar}>
                    {data.others.down > 0 && (
                      <div
                        className={styles.down}
                        style={{ width: data.others.downChg }}
                      >
                        <span>{data.others.down}</span>
                      </div>
                    )}
                    {data.others.neutral > 0 && (
                      <div
                        className={styles.neutral}
                        style={{ width: data.others.neutralChg }}
                      >
                        <span>{data.others.neutral}</span>
                      </div>
                    )}
                    {data.others.up > 0 && (
                      <div
                        className={styles.up}
                        style={{ width: data.others.upChg }}
                      >
                        <span>{data.others.up}</span>
                      </div>
                    )}
                  </div>
                )}
              </td>
              <td className={styles.noData}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScrollableBarsTableMarketMood;
