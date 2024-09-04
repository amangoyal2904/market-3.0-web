import styles from "./styles.module.scss";
import DeclaredCards from "../DeclaredCards";
import UpcomingResults from "../UpcomingResults";
import { useState, useEffect } from "react";
import PaginationEarning from "../../BigBullTableCard/PaginationEarning";

import {
  commonGetAPIHandler,
  commonPostAPIHandler,
} from "../../../utils/screeners";

const leftSideTabData = [
  { title: "Latest Results", value: "latest-results", id: 0, link: "" },
  { title: "Sales Gainers", value: "sales-gainers", id: 1, link: "" },
  { title: "Sales Losers", value: "sales-losers", id: 2, link: "" },
  { title: "Profit Gainers", value: "profit-gainers", id: 3, link: "" },
  { title: "Profit Losers", value: "profit-losers", id: 4, link: "" },
];

const DeclaredPage = ({
  data,
  selectedFilter,
  queryParameter,
  queryResult,
}: any) => {
  const [activeResultValue, setActiveResultValue] = useState("latest-results");
  const [_cardLoading, setCardLoading] = useState(false);
  const [_declareCompanies, setDeclareCompanies] = useState(
    data?.declaredCompanies,
  );
  const [topTabTimeHide, setTopTabTimeHide] = useState("no");
  const [tabDateTime, setTabDateTime] = useState(
    data.payload.declareResultTablePayload.date || "",
  );
  const [_pageSummary, setPageSummary] = useState(
    data?.declaredCompanies?.pageSummary,
  );
  const [activeTab, setActiveTab] = useState(0);
  const tabChangeHandler = (index: any, value: any) => {
    setActiveTab(index);
    const newPayload: any = { ..._declareResultTablePayload };
    newPayload.apiType = value;
    newPayload.pageNo = 1;
    if (value === "latest-results") {
      newPayload.date = tabDateTime;
      setTopTabTimeHide("no");
    } else {
      newPayload.date = "";
      setTopTabTimeHide("yes");
    }
    //
    setDeclareResultTablePayload(newPayload);
  };
  const [_declareResultTablePayload, setDeclareResultTablePayload] = useState(
    data?.payload?.declareResultTablePayload,
  );
  const setActiveResultHandler = (value: string) => {
    //console.log("___",value)
    setActiveResultValue(value);
  };
  const upcomingResultTableHandler = (date: any, type: any) => {
    //console.log("__tableclick ", { date, type });
    if (type === "declared") {
      const newPayload: any = { ..._declareResultTablePayload, pageNo: 1 };
      newPayload.date = date;
      setTabDateTime(date);
      setDeclareResultTablePayload(newPayload);
    }
  };
  const callDeclaredTableData = async () => {
    setCardLoading(true);
    const responseData = await commonPostAPIHandler(
      "DECLARED_COMPANIES",
      _declareResultTablePayload,
    );
    //console.log("___DECLARED_COMPANIESdata", responseData);
    if (responseData) {
      setDeclareCompanies(responseData);
      setPageSummary(responseData?.pageSummary);
    } else {
      // here fall condition do
    }
    setCardLoading(false);
  };
  const niftyFIlterHandler = (type: string, niftySelectedFilterData: any) => {
    //console.log("call nifty fitler handler", {type, niftySelectedFilterData});
    if (type === "declared") {
      const newPayload: any = { ..._declareResultTablePayload, pageNo: 1 };
      newPayload.filterValue =
        niftySelectedFilterData?.indexId !== 0
          ? [niftySelectedFilterData?.indexId]
          : [];
      setDeclareResultTablePayload(newPayload);
    }
  };
  const handlePageChange = (value: "any") => {
    console.log("value page ki", value);
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling
    });
    const newPayload: any = { ..._declareResultTablePayload, pageNo: value };
    setDeclareResultTablePayload(newPayload);
  };
  useEffect(() => {
    //console.log("_____declareResultTablePayload", _declareResultTablePayload);
    callDeclaredTableData();
  }, [_declareResultTablePayload]);
  return (
    <>
      <div className={styles.cardSec}>
        <div className={styles.left}>
          <ul className={styles.leftNavList}>
            {leftSideTabData.map((item: any, index: number) => {
              const isActive =
                queryParameter !== "" && queryResult !== ""
                  ? index === 0
                  : index === activeTab;
              return (
                <li
                  className={`${isActive ? styles.active : ""} ${queryParameter !== "" && queryResult !== "" ? styles.noCursor : ""}`}
                  key={`-${item.title}-${index}`}
                  onClick={() => {
                    queryParameter !== "" && queryResult !== ""
                      ? undefined
                      : tabChangeHandler(index, item.value);
                  }}
                >
                  {item.title}
                </li>
              );
            })}
          </ul>
        </div>

        <div className={`${styles.right} `}>
          <UpcomingResults
            title=""
            type="declared"
            tabData={data.declaredCalendar}
            selectedFilter={selectedFilter}
            searchFilter="yes"
            niftyFilter={
              queryParameter !== "" && queryResult !== "" ? "no" : "yes"
            }
            latestFilter="no"
            topTabTimeHide={topTabTimeHide}
            activeResultValue={activeResultValue}
            setActiveResultHandler={setActiveResultHandler}
            upcomingResultTableHandler={upcomingResultTableHandler}
            niftyFIlterHandler={niftyFIlterHandler}
            showLeftNavigation={
              queryParameter !== "" && queryResult !== "" ? "no" : "yes"
            }
            showResultTopTxt={topTabTimeHide}
            pageSummary={_pageSummary}
            bigSearchShow={
              queryParameter !== "" && queryResult !== "" ? "yes" : "no"
            }
          />
          <DeclaredCards
            data={
              queryParameter !== "" && queryResult !== ""
                ? queryResult
                : _declareCompanies
            }
            loading={_cardLoading}
            showViewAll="no"
          />
          {queryParameter !== "" && queryResult !== "" ? (
            ""
          ) : _pageSummary && _pageSummary.totalpages > 1 ? (
            <PaginationEarning
              pageSummary={_pageSummary}
              onPageChange={handlePageChange}
              paginationLastNode={`Declard Results`}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default DeclaredPage;
