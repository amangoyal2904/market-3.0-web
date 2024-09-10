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
} from "../../../../utils/screeners";

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
  //console.log("_data_tableData", queryParameter);
  const _title = "Upcoming  Results";
  const _desc = `A quarterly report is a summary or collection of unaudited financial statements, such as balance sheets, income statements, and cash flow statements, issued by companies every quarter (three months). The quarterly reports and financial statements indicate the business's quarterly development. To protect the interests of investors, SEBI (Securities and Exchange Board of India) requires every listed firm to produce quarterly reports.`;
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
    console.log("___data", responseData);
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
      if (getData) {
        setUpcomingCalendar(getData);
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

  useEffect(() => {
    //console.log("_____upcomingResultTablePayload", _upcomingResultTablePayload);
    //callUpcomingTableData();
  }, [_upcomingResultTablePayload]);
  useEffect(() => {
    // if (companyid && companyid !== "") {
    //   setUpcomingCompanies(
    //     data?._upcomingCompaniesQuery?.dataList
    //       ? data?._upcomingCompaniesQuery
    //       : data?.upcomingCompanies,
    //   );
    //   setUpcomingResultTablePayload(
    //     data?._upcomingCompaniesQuery?.dataList
    //       ? data?.payload?.queryPayload
    //       : data?.payload?.upcomingResultTablePayload,
    //   );
    // } else {
    //   setUpcomingCompanies(data?.upcomingCompanies);
    //   setUpcomingResultTablePayload(data?.payload?.upcomingResultTablePayload);
    // }
  }, [companyid]);
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
      />
      <LatestResultNewsSec topNewsData={data?.topNewsData} />
    </>
  );
};

export default UpcomingResultsClintPage;
