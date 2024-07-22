import { formatNumber, getClassAndPercent } from "@/utils";
import styles from "./FIIDII.module.scss";

interface MaxOtherDataItem {
  value1_1: number;
  value1_2: number;
}

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

const FiiDiiSummary = ({ summaryData }: any) => {
  const { listData } = summaryData;

  // Calculate maxValuesSummary using column data
  const maxValuesSummary = listData.reduce(
    (acc: MaxOtherDataItem, data: any) => {
      const absValue1_1 = Math.abs(data.value1_1);
      const absValue1_2 = Math.abs(data.value1_2);

      if (absValue1_1 > acc.value1_1) acc.value1_1 = absValue1_1;
      if (absValue1_2 > acc.value1_2) acc.value1_2 = absValue1_2;

      return acc;
    },
    { value1_1: 0, value1_2: 0 },
  );

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
          if (tdData.datelable.toLowerCase() === "1 week") {
            timelineText = "For Last 7 days";
          } else if (tdData.datelable.toLowerCase() === "last 30 days") {
            timelineText = "For Last 30 days";
          } else {
            const [day, month] = tdData.datelable.split(" ");
            const date = parseInt(day);
            const suffix = getDateSuffix(date);
            const year = tdData.dateStr.split("-")[2]; // Extract the year from dateStr
            timelineText = `As on ${date}${suffix} ${month} ${year}`;
          }

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
                    <td>FII Cash Activity</td>
                    <td className={upDownTypeValue11}>
                      <div className={styles.barCell}>
                        <div
                          className={`${styles.bar} upDownBgBar`}
                          style={{
                            width: `${(Math.abs(tdData.value1_1) * 100) / maxValuesSummary.value1_1 / 2}%`,
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
                    <td>DII Cash Activity</td>
                    <td className={upDownTypeValue12}>
                      <div className={styles.barCell}>
                        <div
                          className={`${styles.bar} upDownBgBar`}
                          style={{
                            width: `${(Math.abs(tdData.value1_2) * 100) / maxValuesSummary.value1_2 / 2}%`,
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
