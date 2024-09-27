import styles from "./styles.module.scss";
import DeclaredCards from "../DeclaredCards";
import UpcomingResults from "../UpcomingResults";
import { useState, useEffect } from "react";
import PaginationEarning from "../../BigBullTableCard/PaginationEarning";
import L3DeclareNav from "../L3DeclareNav";

import {
  commonGetAPIHandler,
  commonPostAPIHandler,
} from "../../../utils/screeners";

const DeclaredPage = ({
  data,
  selectedFilter,
  queryParameter,
  queryResult,
  topTabTimeHide = "no",
  paginationTxt = "",
  queryTitle = "",
}: any) => {
  const [activeResultValue, setActiveResultValue] = useState("latest-results");
  const [_cardLoading, setCardLoading] = useState(false);
  const [_declareCompanies, setDeclareCompanies] = useState(
    data?.declaredCompanies,
  );
  const [declaredCalendar, setDeclaredCalendar] = useState(
    data.declaredCalendar,
  );

  const [tabDateTime, setTabDateTime] = useState(
    data.payload.declareResultTablePayload.date || "",
  );
  const [_pageSummary, setPageSummary] = useState(
    data?.declaredCompanies?.pageSummary,
  );
  //const [activeTab, setActiveTab] = useState(0);
  // const tabChangeHandler = (index: any, value: any) => {
  //   setActiveTab(index);
  //   const newPayload: any = { ..._declareResultTablePayload };
  //   newPayload.apiType = value;
  //   newPayload.pageNo = 1;
  //   if (value === "latest-results") {
  //     newPayload.date = tabDateTime;
  //     setTopTabTimeHide("no");
  //   } else {
  //     newPayload.date = "";
  //     setTopTabTimeHide("yes");
  //   }
  //   //
  //   setDeclareResultTablePayload(newPayload);
  // };
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
  const callAPIDeclaredCalendar = async (filterType: any, filterValue: any) => {
    //console.log({filterType,filterValue})
    try {
      let queryParams = `?apiType=declared`;
      if (
        filterType &&
        filterValue !== undefined &&
        filterValue !== null &&
        filterValue !== 0
      ) {
        const filterTypeParam = `filterType=${filterType}`;
        const filterValueParam = `filterValue=${filterValue}`;
        queryParams += `&${filterTypeParam}&${filterValueParam}`;
      }
      //console.log('Final queryParams:', queryParams);
      const getData = await commonGetAPIHandler(
        `SCREENER_CALENDAR`,
        queryParams,
      );
      if (getData && getData?.calendarData) {
        setDeclaredCalendar(getData?.calendarData);
      }
      //console.log("getData declared",getData)
    } catch (error) {
      console.log("error api declare calander", error);
    }
  };
  const niftyFIlterHandler = (type: string, niftySelectedFilterData: any) => {
    //console.log("call nifty fitler handler", {type, niftySelectedFilterData});
    if (type === "declared") {
      const filterValue = niftySelectedFilterData?.indexId;
      const filterType =
        filterValue == undefined || !isNaN(Number(filterValue))
          ? "index"
          : "marketcap";

      const newPayload: any = { ..._declareResultTablePayload, pageNo: 1 };
      newPayload.filterValue =
        niftySelectedFilterData?.indexId !== 0
          ? [niftySelectedFilterData?.indexId]
          : [];
      newPayload.filterType = filterType;
      setDeclareResultTablePayload(newPayload);
      callAPIDeclaredCalendar(filterType, filterValue);
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
          <L3DeclareNav />
        </div>

        <div className={`${styles.right} `}>
          <UpcomingResults
            title=""
            type="declared"
            tabData={declaredCalendar}
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
            queryTitle={queryTitle}
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
              paginationLastNode={`${paginationTxt}`}
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
