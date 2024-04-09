import React, { useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import WatchlistAddition from "../WatchlistAddition";
import Blocker from "../Blocker";
import { APP_ENV, dateFormat, formatNumber } from "../../utils";
import { useStateContext } from "../../store/StateContext";
import Link from "next/link";
import GLOBAL_CONFIG from "@/network/global_config.json";

const TableHtml = (props: any) => {
  const { recosDetailResult, activeApi, urlFilterHandle } = props;
  const fixedTheadRef = useRef<HTMLTableSectionElement>(null);
  const scrollableTheadRef = useRef<HTMLTableSectionElement>(null);

  const handleScroll = () => {
    //console.log(12345, fixedTableRef.current, scrollableTableRef.current)
    let scrollTopValue =
      window.pageYOffset || document.documentElement.scrollTop;
    console.log("scrollTopValue---", scrollTopValue);
    const element = document.querySelector(`.${styles["gridMainBox"]}`);
    let topValue = element instanceof HTMLElement ? element.offsetTop : 0;
    let finalScrollTopValue =
      scrollTopValue > topValue ? scrollTopValue - topValue : 0;

    if (
      finalScrollTopValue > 0 &&
      fixedTheadRef.current &&
      scrollableTheadRef.current
    ) {
      fixedTheadRef.current.style.transform = `translateY(${finalScrollTopValue}px)`;
      fixedTheadRef.current.style.top = `100px`;
      scrollableTheadRef.current.style.transform = `translateY(${finalScrollTopValue}px)`;
      scrollableTheadRef.current.style.top = `100px`;
    } else if (
      finalScrollTopValue == 0 &&
      fixedTheadRef.current &&
      scrollableTheadRef.current
    ) {
      fixedTheadRef.current.style.transform = `translateY(${finalScrollTopValue}px)`;
      fixedTheadRef.current.style.top = `0px`;
      scrollableTheadRef.current.style.transform = `translateY(${finalScrollTopValue}px)`;
      scrollableTheadRef.current.style.top = `0px`;
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const tableHead = (tableType: any) => {
    let activeTabHead: any = [];
    switch (activeApi) {
      case "newRecos":
        activeTabHead = [
          "Stock Name",
          "Recommendation",
          "Potential Upside/Downside",
          "Target Price",
          "Current Price",
          "Price at Recos",
          "Brokerage House",
          "Report",
        ];
        break;
      case "FHDetail":
        activeTabHead = [
          "Stock Name",
          "Recommendation",
          "Potential Upside/Downside",
          "Target Price",
          "Current Price",
          "Price at Recos",
          "Report",
        ];
        break;
      case "mostBuy":
        activeTabHead = [
          "Stock Name",
          "Potential Upside/Downside",
          "Avg. Target",
          "Current Price",
          "Buy",
          "Sell",
          "Hold",
          "Total",
        ];
        break;
      case "mostSell":
        activeTabHead = [
          "Stock Name",
          "Potential Upside/Downside",
          "Avg. Target",
          "Current Price",
          "Buy",
          "Sell",
          "Hold",
          "Total",
        ];
        break;
      case "recoOnWatchlist":
        activeTabHead = [
          "Stock Name",
          "Potential Upside/Downside",
          "Avg. Target",
          "Current Price",
          "Buy",
          "Sell",
          "Hold",
          "Total",
        ];
        break;
      case "recoByFH":
        activeTabHead = [
          "Brokerage",
          "Total Recos",
          "Buy",
          "Sell",
          "Hold",
          "Add",
          "Accumulate",
          "Neutrals",
        ];
        break;
    }

    return (
      <>
        {tableType == "fixed" ? (
          <th
            className={styles.companyNameTH}
            key={`stockrecos_activeTabHead_${0}`}
          >
            {activeTabHead[0]}
          </th>
        ) : (
          activeTabHead.map((item: any, index: any) => {
            return (
              <>
                {index > 0 && (
                  <th
                    key={`stockrecos_activeTabHead_${index}`}
                    data-name={item}
                  >
                    {item}
                  </th>
                )}
              </>
            );
          })
        )}
      </>
    );
  };

  const fundHousesDetail = (obj: any) => {
    return (
      <>
        <td>
          <div className={`numberFonts ${styles.totalCountVal}`}>
            {formatNumber(obj.totalCount)}
          </div>
        </td>
        <td>
          <div className={`numberFonts ${styles.buyCountVal}`}>
            {formatNumber(obj.buyCount)}
          </div>
        </td>
        <td>
          <div className={`numberFonts ${styles.sellCountVal}`}>
            {formatNumber(obj.sellCount)}
          </div>
        </td>
        <td>
          <div className={`numberFonts ${styles.holdCountVal}`}>
            {formatNumber(obj.holdCount)}
          </div>
        </td>
        <td>
          <div className={`numberFonts ${styles.addCountVal}`}>
            {formatNumber(obj.addCount)}
          </div>
        </td>
        <td>
          <div className={`numberFonts ${styles.accumulateCountVal}`}>
            {formatNumber(obj.accumulateCount)}
          </div>
        </td>
        <td>
          <div className={`numberFonts ${styles.neutralCountVal}`}>
            {formatNumber(obj.neutralCount)}
          </div>
        </td>
      </>
    );
  };

  const newRecosDetail = (obj: any) => {
    return (
      <>
        <td className={styles.recommendation}>
          <div
            className={`${styles.buySellTitle} ${obj.potentialDirection == "Up" ? styles.green : obj.potentialDirection == "Down" ? styles.red : obj.potentialDirection == "Neutral" ? styles.gray : styles.green}`}
          >
            {activeApi == "mostBuy"
              ? "Buy"
              : activeApi == "mostSell"
                ? "Sell"
                : obj.recoType}
          </div>
          <span className={styles.callDateBox}>
            {/* <span className={styles.callDateTitle}>Call Date: </span> */}
            <span className={styles.callDate}>
              {dateFormat(obj.priceAtRecosDate, "%MMM %d, %Y")}
            </span>
          </span>
        </td>
        <td>
          {obj.potentialDirection == "Up" ? (
            <span
              className={`numberFonts ${styles.upSide} ${styles.potential}`}
            >
              {obj.potentialValue}%{" "}
              <span className={`eticon_up_arrow ${styles.icons}`}></span>
            </span>
          ) : obj.potentialDirection == "Down" ? (
            <span
              className={`numberFonts ${styles.downSide} ${styles.potential}`}
            >
              {obj.potentialValue}%{" "}
              <span className={`eticon_down_arrow ${styles.icons}`}></span>
            </span>
          ) : (
            <>
              {obj.potentialValue > 0 ? (
                <span
                  className={`numberFonts ${styles.neutral} ${styles.potential}`}
                >
                  {obj.potentialValue}%{" "}
                  <span className={`${styles.icons}`}></span>
                </span>
              ) : (
                <span
                  className={`${styles.neutral} ${styles.potential} ${styles.targetMet}`}
                >
                  Target Met
                </span>
              )}
            </>
          )}
        </td>
        <td>
          <div className={`numberFonts ${styles.targetPrice}`}>
            <span className={`eticon_rupee`}></span>
            {formatNumber(obj.target)}
          </div>
        </td>
        <td>
          <div className={`numberFonts ${styles.currentPriceVal}`}>
            <span className={`eticon_rupee`}></span>
            {formatNumber(obj.currentPrice)}
          </div>
        </td>
        <td>
          <div className={`numberFonts ${styles.recosPriceVal}`}>
            <span className={`eticon_rupee`}></span>
            {formatNumber(obj.priceAtRecos)}
          </div>
        </td>
        {activeApi == "newRecos" && (
          <td className={styles.newRecosfundName}>
            <div className={styles.organisationName}>
              <Link
                href={`/stocksrecos/fundhousedetails/${obj.organisation?.toLowerCase().replace(/ /g, "-")}-${obj.omId}/all${urlFilterHandle()}`}
                className="linkHover"
              >
                {obj.organisation}
              </Link>
            </div>
          </td>
        )}
        <td className={styles.pdfIcon}>
          <a href={obj.pdfUrl} target="_blank">
            <img src="/icon_pdf.svg" width="20" height="20" />
            {/* <span className={`eticon_pdf`}>
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
            </span> */}
          </a>
        </td>
      </>
    );
  };

  const MixTableDetail = (obj: any) => {
    return (
      <>
        <td>
          {obj.potentialDirection == "Up" ? (
            <span className={`${styles.upSide} ${styles.potential}`}>
              {obj.potentialValue}%{" "}
              <span className={`eticon_up_arrow ${styles.icons}`}></span>
            </span>
          ) : obj.potentialDirection == "Down" ? (
            <span className={`${styles.downSide} ${styles.potential}`}>
              {obj.potentialValue}%{" "}
              <span className={`eticon_down_arrow ${styles.icons}`}></span>
            </span>
          ) : (
            <>
              {obj.potentialValue > 0 ? (
                <span
                  className={`numberFonts ${styles.neutral} ${styles.potential}`}
                >
                  {obj.potentialValue}%{" "}
                  <span className={`${styles.icons}`}></span>
                </span>
              ) : (
                <span
                  className={`${styles.neutral} ${styles.potential} ${styles.targetMet}`}
                >
                  Target Met
                </span>
              )}
            </>
          )}
        </td>
        <td>
          <div className={styles.avgTargetVal}>
            <span className={`eticon_rupee`}></span>
            {formatNumber(obj.target)}
          </div>
        </td>
        <td>
          <div className={styles.currentPriceVal}>
            <span className={`eticon_rupee`}></span>
            {formatNumber(obj.currentPrice)}
          </div>
        </td>
        <td>
          <div className={styles.buyCountVal}>{formatNumber(obj.buyCount)}</div>
        </td>
        <td>
          <div className={styles.sellCountVal}>
            {formatNumber(obj.sellCount)}
          </div>
        </td>
        <td>
          <div className={styles.holdCountVal}>
            {formatNumber(obj.holdCount)}
          </div>
        </td>
        <td>
          <div className={styles.totalCountVal}>
            {formatNumber(obj.totalCount)}
          </div>
        </td>
      </>
    );
  };

  return (
    <>
      <div id="fixedTable" className={styles.fixedWrap}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead
            ref={fixedTheadRef}
            style={{ position: "sticky", top: "0", zIndex: "1" }}
          >
            <tr>{tableHead("fixed")}</tr>
          </thead>
          <tbody>
            {recosDetailResult?.map((obj: any, index: any) => {
              return (
                <tr key={`recosTable_${index}`}>
                  {activeApi == "recoByFH" ? (
                    <td>
                      <div className={styles.tdColWrap}>
                        <Link
                          title={obj.organisation}
                          href={`/stocksrecos/fundhousedetails/${obj.organisation?.toLowerCase().replace(/ /g, "-")}-${obj.omId}/all${urlFilterHandle()}`}
                          className="linkHover"
                        >
                          <span className={`${styles.companyName} linkHover`}>
                            {obj.organisation}
                          </span>
                        </Link>
                      </div>
                    </td>
                  ) : (
                    <td>
                      <div className={styles.tdColWrap}>
                        <WatchlistAddition
                          companyName={obj.companyName}
                          companyId={obj.companyId}
                          companyType="equity"
                          customStyle={{
                            position: "relative",
                            marginRight: "10px",
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        <Link
                          title={obj.companyName}
                          target="_blank"
                          href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}/${obj.companyName?.toLowerCase().replace(/ /g, "-")}/stocks/companyid-${obj.companyId}.cms`}
                          className="linkHover"
                        >
                          <span className={`${styles.companyName} linkHover`}>
                            {obj.companyName}
                          </span>
                        </Link>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div id="scrollableTable" className={styles.scrollWrap}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead
            ref={scrollableTheadRef}
            style={{ position: "sticky", top: "0", zIndex: "1" }}
          >
            <tr>
              {tableHead("scroll")}
              <th className={styles.lastMaxTD}></th>
            </tr>
          </thead>
          <tbody>
            {recosDetailResult?.map((obj: any, index: any) => (
              <tr key={`recosTable_${index}`}>
                {activeApi == "recoByFH"
                  ? fundHousesDetail(obj)
                  : activeApi == "newRecos" || activeApi == "FHDetail"
                    ? newRecosDetail(obj)
                    : MixTableDetail(obj)}
                <td className={styles.lastMaxTD}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const Grid = (props: any) => {
  const { recosDetailResult, activeApi } = props;
  const { state, dispatch } = useStateContext();
  const { isLogin } = state.login;

  return (
    <>
      {recosDetailResult && (
        <div className={styles.gridMainBox}>
          <div
            className={`${styles.tableWrapper} ${styles[activeApi]}`}
            id="table"
          >
            <TableHtml {...props} />
          </div>
        </div>
      )}
    </>
  );
};
export default Grid;
