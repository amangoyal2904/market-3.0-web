import { formatNumber } from "@/utils";
import styles from "./IndicesDetails.module.scss";

const IndicesReturns = ({ data }: any) => {
  const labels = [""];
  const returnPercentages = ["Returns"];
  const highs = ["High"];
  const lows = ["Low"];

  for (const item of data) {
    labels.push(item.label);
    returnPercentages.push(item.returnPercentage);
    highs.push(item.high);
    lows.push(item.low);
  }
  const otherData = [returnPercentages, highs, lows];
  return (
    <>
      <h2 className={styles.heading}>Returns</h2>
      <table className={styles.marketsCustomTable}>
        <thead>
          <tr>
            {labels.map((label, index) => (
              <th key={index} className={styles.center}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {otherData.map((data: any, index: number) => (
            <tr key={index}>
              {data.map((value: any, i: number) => (
                <td
                  key={i}
                  className={`${i == 0 ? styles.left : `${styles.center} numberFonts`} ${
                    index == 0
                      ? value > 0
                        ? "up"
                        : value < 0
                          ? "down"
                          : ""
                      : ""
                  }`}
                >
                  {index == 0 ? (
                    <>
                      {`${isNaN(value) ? value : !!value ? value + "%" : "-"}`}
                      <span
                        className={`${styles.arrowIcons} ${
                          value > 0
                            ? "eticon_up_arrow"
                            : value < 0
                              ? "eticon_down_arrow"
                              : ""
                        }`}
                      />
                    </>
                  ) : i === 0 ? (
                    value
                  ) : (
                    formatNumber(value)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default IndicesReturns;
