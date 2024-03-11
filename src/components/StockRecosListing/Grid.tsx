import React from "react";
import styles from "./styles.module.scss";
import WatchlistAddition from "../WatchlistAddition";
import { json } from "stream/consumers";
import Blocker from "../Blocker";

const TableHtml = (props: any) => {
  const { recosDetailResult, activeApi } = props;

  const tableHead = () => {
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
      case "recoOnWL":
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
        {activeTabHead.map((item: any, index: any) => {
          return (
            <>
              <th key={`stockrecos_activeTabHead_${index}`}>{item}</th>
            </>
          );
        })}
      </>
    );
  };

  const fundHousesDetail = (obj: any) => {
    return (
      <>
        <td>
          <div className={styles.tdColWrap}>
            <span>{obj.organisation}</span>
          </div>
        </td>
        <td>
          <div className={styles.totalCountVal}>{obj.totalCount}</div>
        </td>
        <td>
          <div className={styles.buyCountVal}>{obj.buyCount}</div>
        </td>
        <td>
          <div className={styles.sellCountVal}>{obj.sellCount}</div>
        </td>
        <td>
          <div className={styles.holdCountVal}>{obj.holdCount}</div>
        </td>
        <td>
          <div className={styles.addCountVal}>-</div>
        </td>
        <td>
          <div className={styles.accumulateCountVal}>-</div>
        </td>
        <td>
          <div className={styles.neutralCountVal}>-</div>
        </td>
      </>
    );
  };

  const newRecosDetail = (obj: any) => {
    return (
      <>
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
                fontSize: "14px",
              }}
            />
            <span>{obj.companyName}</span>
          </div>
        </td>
        <td></td>
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
            <span className={`${styles.neutral} ${styles.potential}`}>
              {obj.potentialValue}% <span className={`${styles.icons}`}></span>
            </span>
          )}
        </td>
        <td>
          <div className={styles.targetPrice}>
            <span className={`eticon_rupee`}></span>
            {obj.target}
          </div>
        </td>
        <td>
          <div className={styles.currentPriceVal}>
            <span className={`eticon_rupee`}></span>
            {obj.currentPrice}
          </div>
        </td>
        <td>
          <div className={styles.recosPriceVal}>
            <span className={`eticon_rupee`}></span>
            {obj.priceAtRecos}
          </div>
        </td>
        <td>
          <div className={styles.organisationName}>{obj.organisation}</div>
        </td>
        <td className={styles.pdfIcon}>
          <a href={obj.pdfUrl} target="_blank">
            <span className={`eticon_pdf`}>
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
            </span>
          </a>
        </td>
      </>
    );
  };

  const MixTableDetail = (obj: any) => {
    return (
      <>
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
                fontSize: "14px",
              }}
            />
            <span>{obj.companyName}</span>
          </div>
        </td>
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
            <span className={`${styles.neutral} ${styles.potential}`}>
              {obj.potentialValue}% <span className={`${styles.icons}`}></span>
            </span>
          )}
        </td>
        <td>
          <div className={styles.avgTargetVal}>
            <span className={`eticon_rupee`}></span>
            {obj.target}
          </div>
        </td>
        <td>
          <div className={styles.currentPriceVal}>
            <span className={`eticon_rupee`}></span>
            {obj.currentPrice}
          </div>
        </td>
        <td>
          <div className={styles.buyCountVal}>{obj.buyCount}</div>
        </td>
        <td>
          <div className={styles.sellCountVal}>{obj.sellCount}</div>
        </td>
        <td>
          <div className={styles.holdCountVal}>{obj.holdCount}</div>
        </td>
        <td>
          <div className={styles.totalCountVal}>{obj.totalCount}</div>
        </td>
      </>
    );
  };

  return (
    <table>
      <thead>
        <tr>{tableHead()}</tr>
      </thead>
      <tbody>
        {recosDetailResult?.recoData?.[0].data.map((obj: any, index: any) => (
          <tr key={`recosTable_${index}`}>
            {activeApi == "recoByFH"
              ? fundHousesDetail(obj)
              : activeApi == "newRecos"
                ? newRecosDetail(obj)
                : MixTableDetail(obj)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Grid = (props: any) => {
  const { recosDetailResult, activeApi } = props;
  console.log(`tabData  --- >`, recosDetailResult);
  return (
    <>
      {typeof recosDetailResult?.recoData?.[0].data != "undefined" ? (
        <div className={styles.gridMainBox}>
          <div className={styles.tableWrapper} id="table">
            <TableHtml {...props} />
          </div>
        </div>
      ) : (
        <div className={`${styles.listingWrap} ${styles.noDataFound}`}>
          <Blocker type={"noDataFound"} />
        </div>
      )}
    </>
  );
};
export default Grid;
