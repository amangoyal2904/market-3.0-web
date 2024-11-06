"use client";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import HeroBanner from "@/components/StocksEarnings/HeroBanner";
import LinkTabs from "@/components/StocksEarnings/LinkTabs";
import UpcomingResults from "@/components/StocksEarnings/UpcomingResults";
import UpcomingTable from "@/components/StocksEarnings/EarningsTable/UpcomingTable";
import LatestResultNewsSec from "@/components/StocksEarnings/LatestResultNewsSec";

import {
  commonGetAPIHandler,
  commonPostAPIHandler,
} from "../../../../../utils/screeners";

const UpcomingResultsClintPage = ({
  data,
  selectedFilter,
  tableData,
  tableHeaderData,
  payload,
  pageSummary,
  unixDateTime,
}: any) => {
  const queryParameter =
    data?.props?.searchParams &&
    data?.props?.searchParams?.companyid &&
    data?.props?.searchParams?.companyid !== ""
      ? data?.props?.searchParams?.companyid
      : "";
  const queryComanyName = tableData[0]?.data?.find(
    (item: any) => item?.keyId === "shortName",
  )?.value;
  //console.log("queryComanyName_____", queryComanyName);

  const _title = "Upcoming  Results";
  const _desc = `Explore upcoming earnings results of all companies with a day-by-day view. Easily search for individual stocks and apply filters to focus on the specific data you need, ensuring you never miss a crucial earnings update`;
  const [_upcomingCompanies, setUpcomingCompanies] = useState(
    data?.props?.searchParams?.companyid !== "" &&
      data?._upcomingCompaniesQuery?.dataList
      ? data?._upcomingCompaniesQuery
      : data?.upcomingCompanies,
  );
  const [upcomingCalendar, setUpcomingCalendar] = useState(
    data.upcomingCalendar,
  );
  const [_upcomingResultTablePayload, setUpcomingResultTablePayload] = useState(
    data?.props?.searchParams?.companyid !== "" &&
      data?._upcomingCompaniesQuery?.dataList
      ? data?.payload?.queryPayload
      : data?.payload?.upcomingResultTablePayload,
  );
  const [niftyFiftyFilterDataUpdate, setNiftyFiftyFilterDataUpdate] = useState({
    ...selectedFilter,
  });
  const [tabDateTimeStore, setTabDateTimeStore] = useState("");
  const [processingLoader, setProcessingLoader] = useState(false);

  const searchParams = useSearchParams();
  const companyid = searchParams.get("companyid");

  const upcomingResultTableHandler = (date: any, type: any) => {
    setTabDateTimeStore(date);
  };
  const callUpcomingTableData = async () => {
    setProcessingLoader(true);

    const responseData = await commonPostAPIHandler(
      "UPCOMING_COMPANIES",
      _upcomingResultTablePayload,
    );
    //console.log("___data", responseData);
    setProcessingLoader(false);
    if (responseData) {
      setUpcomingCompanies(responseData);
    } else {
      // here fall condition do
    }
  };
  const callAPIUpcomingCalendar = async (filterType: any, filterValue: any) => {
    try {
      let queryParams = `?apiType=upcoming`;
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
      const getData = await commonGetAPIHandler(
        `SCREENER_CALENDAR`,
        queryParams,
      );
      if (getData && getData?.calendarData) {
        setUpcomingCalendar(getData?.calendarData || []);
      }
      //console.log("getData upcoming",getData)
    } catch (error) {
      console.log("error api upcoming calander", error);
    }
  };
  const niftyFIlterHandler = (type: string, niftySelectedFilterData: any) => {
    setNiftyFiftyFilterDataUpdate(niftySelectedFilterData);
    const filterValue = niftySelectedFilterData?.indexId;
    const filterType =
      filterValue == undefined || !isNaN(Number(filterValue))
        ? "index"
        : "marketcap";
    callAPIUpcomingCalendar(filterType, filterValue);
  };
  return (
    <>
      <HeroBanner title={_title} desc={_desc} />
      <LinkTabs />
      <UpcomingResults
        title=""
        type="upcoming"
        tabData={upcomingCalendar}
        selectedFilter={selectedFilter}
        searchFilter="yes"
        niftyFilter={queryParameter !== "" ? "no" : "yes"}
        topTabTimeHide={queryParameter !== "" ? "yes" : "no"}
        upcomingResultTableHandler={upcomingResultTableHandler}
        niftyFIlterHandler={niftyFIlterHandler}
        bigSearchShow={queryParameter !== "" ? "yes" : "no"}
        queryComanyName={queryComanyName}
      />
      <UpcomingTable
        //data={_upcomingCompanies}
        processingLoader={processingLoader}
        setProcessingLoader={setProcessingLoader}
        tableData={tableData}
        tableHeaderData={tableHeaderData}
        payload={payload}
        pageSummary={pageSummary}
        unixDateTime={unixDateTime}
        niftyFiftyDataUpdatePayload={niftyFiftyFilterDataUpdate}
        tabDateTimeStorePayload={tabDateTimeStore}
        queryComanyName={queryComanyName}
      />
      <LatestResultNewsSec topNewsData={data?.topNewsData} />
    </>
  );
};

export default UpcomingResultsClintPage;
