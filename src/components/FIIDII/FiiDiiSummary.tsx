import { formatNumber, getClassAndPercent } from "@/utils";
import styles from "./FIIDII.module.scss";

// Function to get the date suffix
const getDateSuffix = (date: number): string => {
  if (date > 3 && date < 21) return "th";
  switch (date % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const renderValueBasedOnType = (type: string, isFII: boolean): string => {
  const valueMap: Record<string, string> = {
    cash: isFII ? "FII Cash Activity" : "DII Cash Activity",
    fiicash: isFII ? "FII Equity" : "DII Equity",
    mfcash: isFII ? "MF-Equity" : "MF-Debt",
    foindex: isFII ? "FII-Index Future" : "FII-Index Option",
    fostock: isFII ? "FII-Stock Future" : "FII-Stock Option",
  };
  return valueMap[type] || (isFII ? "FII Activity" : "DII Activity");
};

const getMaxAbsValue = (data: any) =>
  Math.max(Math.abs(data.value1_1), Math.abs(data.value1_2));

const FiiDiiSummary = ({ summaryData, type }: any) => {
  const { listData } = summaryData;

  return (
    <div className={styles.cards}>
      {listData
        .slice()
        .reverse()
        .map((tdData: any, index: number) => {
          const upDownTypeValue11 = getClassAndPercent(tdData.value1_1);
          const upDownTypeValue12 = getClassAndPercent(tdData.value1_2);

          // Generate timeline text
          let timelineText = "";
          const dateLableLower = tdData.datelable.toLowerCase();
          if (dateLableLower === "1 week") {
            timelineText = "For Last 7 days";
          } else if (dateLableLower === "last 30 days") {
            timelineText = "For Last 30 days";
          } else {
            const [day, month] = tdData.datelable.split(" ");
            const date = parseInt(day);
            const suffix = getDateSuffix(date);
            const year = tdData.dateStr.split("-")[2]; // Extract the year from dateStr
            timelineText = `As on ${date}${suffix} ${month} ${year}`;
          }

          const maxAbsValue = getMaxAbsValue(tdData);
          const calculateWidth = (value: number) => {
            const width = (Math.abs(value) * 100) / maxAbsValue / 2;
            return width < 23 && width != 0 ? width + 5 : width;
          };

          return (
            <div className={styles.card} key={`summary_${index}`}>
              <div className={styles.head}>
                {timelineText && (
                  <span className={styles.timeline}>{timelineText}</span>
                )}
                <span className={styles.helpTxt}>
                  * All values in Rs. (Cr.)
                </span>
              </div>
              <table className={styles.rowData}>
                <tbody>
                  <tr>
                    <td>{renderValueBasedOnType(type, true)}</td>
                    <td className={upDownTypeValue11}>
                      <div className={styles.barCell}>
                        <div
                          className={`${styles.bar} upDownBgBar`}
                          style={{
                            width: `${calculateWidth(tdData.value1_1)}%`,
                          }}
                        ></div>
                        <div className={styles.separator}></div>
                      </div>
                    </td>
                    <td className={`${upDownTypeValue11} numberFonts`}>
                      {formatNumber(tdData.value1_1)}
                    </td>
                  </tr>
                  <tr>
                    <td>{renderValueBasedOnType(type, false)}</td>
                    <td className={upDownTypeValue12}>
                      <div className={styles.barCell}>
                        <div
                          className={`${styles.bar} upDownBgBar`}
                          style={{
                            width: `${calculateWidth(tdData.value1_2)}%`,
                          }}
                        ></div>
                        <div className={styles.separator}></div>
                      </div>
                    </td>
                    <td className={`${upDownTypeValue12} numberFonts`}>
                      {formatNumber(tdData.value1_2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
    </div>
  );
};

export default FiiDiiSummary;
