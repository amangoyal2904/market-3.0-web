import styles from "./styles.module.scss";
import PieChart from "../../HighCharts/PieChart";
import React, { useEffect, useMemo } from "react";

const RightSecModule = React.memo(
  ({ title, stocksList, tabHandler, activeTab }: any) => {
    const colorChart: any = [
      "rgba(105, 138, 207, 1)",
      "rgba(255, 214, 151, 1)",
      "rgba(248, 165, 179, 1)",
      "rgba(95, 226, 95, 1)",
      "rgba(255, 186, 82, 1)",
    ];
    const pieChartData = useMemo(() => {
      return (
        stocksList.length > 0 &&
        stocksList.map((stock: any, index: number) => {
          return {
            name: stock?.uiLabel?.text,
            sliced: false,
            selected: false,
            y: parseFloat(stock?.uiValue?.text),
            color: colorChart[index],
          };
        })
      );
    }, [stocksList]);

    return (
      <>
        <div className={styles.topGraph}>
          <h3 className={styles.head3}>{title}</h3>
          <ul className={styles.stockNavTab}>
            <li
              className={`${activeTab === "stocks" ? styles.active : ""}`}
              onClick={() => tabHandler("stocks")}
            >
              Stocks
            </li>
            <li
              className={`${activeTab === "sectors" ? styles.active : ""}`}
              onClick={() => tabHandler("sectors")}
            >
              Sectors
            </li>
          </ul>
        </div>
        <div className={styles.botomGraphSec}>
          <div className={styles.graphDo}>
            <PieChart data={pieChartData} containerId="myChartContainer" />
            <div id="myChartContainer"></div>
          </div>
          <ul className={styles.listItemStock}>
            {stocksList.length > 0
              ? stocksList.map((stock: any, index: number) => {
                  return (
                    <li key={`-s${index}`}>
                      <span className={styles.color}></span>
                      <span className={styles.comTxt}>
                        {stock?.uiLabel?.text}
                      </span>
                      <span className={styles.colPr}>
                        {stock?.uiValue?.text}
                      </span>
                    </li>
                  );
                })
              : ""}
          </ul>
        </div>
      </>
    );
  },
);

RightSecModule.displayName = "RightSecModule";
export default RightSecModule;
