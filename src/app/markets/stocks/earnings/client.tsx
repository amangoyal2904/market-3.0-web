"use client";
import { useEffect, useState } from "react";

import HeroBanner from "@/components/StocksEarnings/HeroBanner";
import LinkTabs from "@/components/StocksEarnings/LinkTabs";
import TopSummaryCards from "@/components/StocksEarnings/TopSummaryCards";
import UpcomingResults from "@/components/StocksEarnings/UpcomingResults";
import EarningsTable from "@/components/StocksEarnings/EarningsTable";
import LatestResultNewsSec from "@/components/StocksEarnings/LatestResultNewsSec";
import DeclaredCards from "@/components/StocksEarnings/DeclaredCards";
import SectorAggregates from "@/components/StocksEarnings/SectorAggregates";
import EarningsWatchlist from "@/components/StocksEarnings/EarningsWatchlist";
import StockScreeners from "@/components/StocksEarnings/StockScreeners";
import {
  commonGetAPIHandler,
  commonPostAPIHandler,
} from "../../../../utils/screeners";

const StocksEarningsClintPage = ({ data, selectedFilter }: any) => {
  const earningScreenersData =
    data?.earningScreeners?.datainfo?.screenerCollectionMasterInfo
      ?.listScreenerCollectionMasterDataInfo || [];
  const [activeResultValue, setActiveResultValue] = useState("latest-results");
  const [processingLoader, setProcessingLoader] = useState(false);
  const [_upcomingResultTablePayload, setUpcomingResultTablePayload] = useState(
    data?.payload?.upcomingResultTablePayload,
  );
  const [_upcomingCompanies, setUpcomingCompanies] = useState(
    data.upcomingCompanies,
  );
  const [_declareResultTablePayload, setDeclareResultTablePayload] = useState(
    data?.payload?.declareResultTablePayload,
  );
  const [_declareCompanies, setDeclareCompanies] = useState(
    data?.declaredCompanies,
  );
  const [_cardLoading, setCardLoading] = useState(false);
  const [_declareTabTimeStore, setDeclareTabTimeStore] = useState(
    data?.payload?.upcomingResultTablePayload?.date || "",
  );
  const [_topTabTimeHide, setTopTabTimeHide] = useState("no");
  const _title = "Quarterly Results";
  const _desc = `A quarterly report is a summary or collection of unaudited financial statements, such as balance sheets, income statements, and cash flow statements, issued by companies every quarter (three months). The quarterly reports and financial statements indicate the business's quarterly development. To protect the interests of investors, SEBI (Securities and Exchange Board of India) requires every listed firm to produce quarterly reports.`;
  const _topSummaryCardData: any = data.topSummaryCardData;
  const setActiveResultHandler = (value: string) => {
    setActiveResultValue(value);
    const newPayload: any = { ..._declareResultTablePayload };
    newPayload.apiType = value;

    console.log("value", value);
    if (value === "latest-results") {
      newPayload.date = _declareTabTimeStore;
      setTopTabTimeHide("no");
    } else {
      newPayload.date = "";
      setTopTabTimeHide("yes");
    }
    setDeclareResultTablePayload(newPayload);
  };
  const upcomingResultTableHandler = (date: any, type: any) => {
    //console.log("__tableclick ", { date, type });
    if (type === "upcoming") {
      const newPayload: any = { ..._upcomingResultTablePayload };
      newPayload.date = date;

      setUpcomingResultTablePayload(newPayload);
      // callUpcomingTableData(date);
    } else if (type === "declared") {
      //callDeclaredTableData(date);
      const newPayload: any = { ..._declareResultTablePayload };
      newPayload.date = date;
      setDeclareResultTablePayload(newPayload);
    }
    setDeclareTabTimeStore(date);
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
    } else {
      // here fall condition do
    }
    setCardLoading(false);
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
  const niftyFIlterHandler = (type: string, niftySelectedFilterData: any) => {
    console.log("call nifty fitler handler", { type, niftySelectedFilterData });
    if (type === "upcoming") {
      const newPayload: any = { ..._upcomingResultTablePayload };
      newPayload.filterValue =
        niftySelectedFilterData?.indexId !== 0
          ? [niftySelectedFilterData?.indexId]
          : [];

      setUpcomingResultTablePayload(newPayload);
    } else if (type === "declared") {
      const newPayload: any = { ..._declareResultTablePayload };
      newPayload.filterValue =
        niftySelectedFilterData?.indexId !== 0
          ? [niftySelectedFilterData?.indexId]
          : [];
      setDeclareResultTablePayload(newPayload);
    }
  };
  console.log("_data", data);
  useEffect(() => {
    //console.log("_____upcomingResultTablePayload", _upcomingResultTablePayload);
    callUpcomingTableData();
  }, [_upcomingResultTablePayload]);
  useEffect(() => {
    //console.log("_____declareResultTablePayload", _declareResultTablePayload);
    callDeclaredTableData();
  }, [_declareResultTablePayload]);
  return (
    <>
      <HeroBanner title={_title} desc={_desc} />
      <LinkTabs />
      <TopSummaryCards data={_topSummaryCardData} />
      <UpcomingResults
        title="Upcoming Results Calendar"
        type="upcoming"
        tabData={data.upcomingCalendar}
        selectedFilter={selectedFilter}
        searchFilter="yes"
        niftyFilter="yes"
        upcomingResultTableHandler={upcomingResultTableHandler}
        niftyFIlterHandler={niftyFIlterHandler}
      />
      <EarningsTable
        data={_upcomingCompanies}
        processingLoader={processingLoader}
      />
      <LatestResultNewsSec topNewsData={data?.topNewsData} />
      <UpcomingResults
        title="Declared Results"
        type="declared"
        tabData={data.declaredCalendar}
        selectedFilter={selectedFilter}
        searchFilter="yes"
        niftyFilter="yes"
        latestFilter="yes"
        activeResultValue={activeResultValue}
        setActiveResultHandler={setActiveResultHandler}
        upcomingResultTableHandler={upcomingResultTableHandler}
        niftyFIlterHandler={niftyFIlterHandler}
        topTabTimeHide={_topTabTimeHide}
        pageSummary={_declareCompanies?.pageSummary}
        showResultTopTxt={_topTabTimeHide}
      />
      <DeclaredCards
        data={_declareCompanies}
        loading={_cardLoading}
        activeResultValue={activeResultValue}
      />
      <SectorAggregates data={data?.sectorData} />
      <EarningsWatchlist />
      <StockScreeners data={earningScreenersData} />
    </>
  );
};

export default StocksEarningsClintPage;
