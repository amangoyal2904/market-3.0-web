import styles from "./styles.module.scss";
import Link from "next/link";
import PieChartSector from "../../HighCharts/PieChartSector";

const StockHeroBanner = ({ summaryData, desc }: any) => {
  const allData = summaryData?.sectorAggregateData[0] || {};
  const allDataGraph = allData.declarationData || {};
  const title = allData?.sectorName || "";
  const maxCompanies = Math.max(
    allDataGraph?.negativeCompanies,
    allDataGraph?.pendingCompanies,
    allDataGraph?.positiveCompanies,
  );
  const negativePercentage =
    (allDataGraph?.negativeCompanies / maxCompanies) * 100;
  const pendingPercentage =
    (allDataGraph?.pendingCompanies / maxCompanies) * 100;
  const positivePercentage =
    (allDataGraph?.positiveCompanies / maxCompanies) * 100;
  const totalCompany = allDataGraph?.declaredCompanies;
  const declareCompany = allDataGraph?.totalCompanies;
  const pieChartData = [
    {
      name: "Negative",
      sliced: false,
      selected: true,
      y: parseFloat(allDataGraph.negativeCompanies),
      color: "#ED193B",
    },
    {
      name: "Pending",
      sliced: false,
      selected: true,
      y: parseFloat(allDataGraph.pendingCompanies),
      color: "#C4C4C4",
    },
    {
      name: "Positive",
      sliced: false,
      selected: true,
      y: parseFloat(allDataGraph.positiveCompanies),
      color: "#709C53",
    },
  ];
  const valueSuffix = "";
  return (
    <>
      <div className={styles.mainWrap}>
        <div className={styles.left}>
          <div className={styles.top}>
            <div className={styles.mainHead}>{title}</div>
            <Link
              className={styles.link}
              href="/markets/stocks/earnings/sector-aggregate/top-performing"
            >
              View all Sectors
            </Link>
          </div>
          <div className={styles.middle}>
            <p className={styles.ptxt}>{`${desc}`}</p>
          </div>
          <div className={styles.bottom}>
            <ul>
              <li>
                <div className={styles.head}></div>
                <div className={styles.subHead}>QoQ</div>
                <div className={styles.subHead}>YoY</div>
              </li>
              <li>
                <div className={styles.headRow}>Revenue</div>
                <div className={styles.subNumber}>
                  <span
                    className={`${allData?.sectorNetSalesQoqAvg > 0 ? styles.up : allData?.sectorNetSalesQoqAvg < 0 ? styles.down : ""}`}
                  >
                    {allData?.sectorNetSalesQoqAvg
                      ? `${allData?.sectorNetSalesQoqAvg}%`
                      : "-"}

                    {allData?.sectorNetSalesQoqAvg > 0 ? (
                      <i className="eticon_up_arrow" />
                    ) : allData?.sectorNetSalesQoqAvg < 0 ? (
                      <i className="eticon_down_arrow" />
                    ) : (
                      ""
                    )}
                  </span>
                </div>
                <div className={styles.subNumber}>
                  <span
                    className={`${allData?.sectorNetSalesYoyAvg > 0 ? styles.up : allData?.sectorNetSalesYoyAvg < 0 ? styles.down : ""}`}
                  >
                    {allData?.sectorNetSalesYoyAvg
                      ? `${allData?.sectorNetSalesYoyAvg}%`
                      : "-"}

                    {allData?.sectorNetSalesYoyAvg > 0 ? (
                      <i className="eticon_up_arrow" />
                    ) : allData?.sectorNetSalesYoyAvg < 0 ? (
                      <i className="eticon_down_arrow" />
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              </li>
              <li>
                <div className={styles.headRow}>Net Profit</div>
                <div className={styles.subNumber}>
                  <span
                    className={`${allData?.sectorPATQoqAvg > 0 ? styles.up : allData?.sectorPATQoqAvg < 0 ? styles.down : ""}`}
                  >
                    {allData?.sectorPATQoqAvg
                      ? `${allData?.sectorPATQoqAvg}%`
                      : "-"}

                    {allData?.sectorPATQoqAvg > 0 ? (
                      <i className="eticon_up_arrow" />
                    ) : allData?.sectorPATQoqAvg < 0 ? (
                      <i className="eticon_down_arrow" />
                    ) : (
                      ""
                    )}
                  </span>
                </div>
                <div className={styles.subNumber}>
                  <span
                    className={`${allData?.sectorPATYoyAvg > 0 ? styles.up : allData?.sectorPATYoyAvg < 0 ? styles.down : ""}`}
                  >
                    {allData?.sectorPATYoyAvg
                      ? `${allData?.sectorPATYoyAvg}%`
                      : "-"}

                    {allData?.sectorPATYoyAvg > 0 ? (
                      <i className="eticon_up_arrow" />
                    ) : allData?.sectorPATYoyAvg < 0 ? (
                      <i className="eticon_down_arrow" />
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.rightTop}>Declared Results</div>
          <div className={styles.rightBtm}>
            <div className={styles.graphSec}>
              <PieChartSector
                data={pieChartData}
                valueSuffix={valueSuffix}
                containerId="myChartContainer"
                totalCompany={totalCompany}
                declareCompany={declareCompany}
              />
              <div id="myChartContainer"></div>
            </div>
            <div className={styles.infoSec}>
              <ul>
                <li>
                  <div className={styles.graphWrap}>
                    <span
                      className={styles.green}
                      style={{ width: `${positivePercentage}%` }}
                    ></span>
                  </div>
                  <div className={styles.graphNo}>
                    {allDataGraph?.positiveCompanies}
                  </div>
                  <div className={styles.graphTxt}>Positive</div>
                </li>
                <li>
                  <div className={styles.graphWrap}>
                    <span
                      className={styles.red}
                      style={{ width: `${negativePercentage}%` }}
                    ></span>
                  </div>
                  <div className={styles.graphNo}>
                    {allDataGraph?.negativeCompanies}
                  </div>
                  <div className={styles.graphTxt}>Negative</div>
                </li>
                <li>
                  <div className={styles.graphWrap}>
                    <span
                      className={styles.gray}
                      style={{ width: `${pendingPercentage}%` }}
                    ></span>
                  </div>
                  <div className={styles.graphNo}>
                    {allDataGraph?.pendingCompanies}
                  </div>
                  <div className={styles.graphTxt}>Pending</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StockHeroBanner;
