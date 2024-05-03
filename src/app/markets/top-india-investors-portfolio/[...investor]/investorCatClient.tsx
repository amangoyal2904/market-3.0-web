"use client";
import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import HeroBanner from "@/components/InvestorModule/HeroBanner";
import InvestorsTopTabs from "@/components/BigBullTabs/InvestorsTopTabs";
import FreshEntryCard from "@/components/BigBullSection/InvestorCatModules/FreshEntryCard";
import InvestorCatModule from "@/components/BigBullTableCard/InvestorCatModule";
import { fetchSelectedFilter } from "@/utils/utility";
import { fetchFilters } from "@/utils/utility";
import StockFilterNifty from "@/components/StockFilterNifty";
import { commonPostAPIHandler } from "../../../../utils/screeners";
import BreadCrumb from "@/components/BreadCrumb";

const InvestorClientCatePage = ({
  data,
  slug,
  pageData,
  title,
  arrayOfCompany,
  pageSummaryInfo,
  tableHead,
  selectedFilter,
  payload,
  pageUrl,
}: any) => {
  const [tableLoadingShow, setTableLoadingShow] = useState(false);
  const [sortByTrade, setSortByTrade]: any = useState([
    { label: "All Entries", value: "ALL" },
    { label: "Sold Entries", value: "SOLD" },
    { label: "Bougth Entries", value: "BOUGHT" },
  ]);
  const [sortByTradeActive, setSortByTradeActive] = useState({
    label: "Sold Entries",
    value: "SOLD",
  });
  const [sortByChangeHolding, setSortByChangeHolding]: any = useState([
    { label: "All", value: "All" },
    { label: "Increase", value: "Increase" },
    { label: "Increase", value: "Decrease" },
  ]);
  const [sortByChangeHoldingActive, setSortByChangeHoldingActive] = useState({
    label: "All",
    value: "All",
  });

  const [showFilter, setShowFilter] = useState(false);
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const sharkSeoName =
    data?.datainfo?.investorOverviewInfo?.investorIntro?.sharkSeoName;
  const sharkID = data?.datainfo?.investorOverviewInfo?.investorIntro?.sharkID;
  const [_arrayOfCompany, setArrayOfCompany] = useState(arrayOfCompany);
  const [filterMenuData, setFilterMenuData]: any = useState("");
  const [_pageSummaryInfo, setPageSummaryInfo] = useState(pageSummaryInfo);
  const [_payload, setPayload]: any = useState(payload);
  const [sortData, setSortData] = useState({ field: null, order: "DESC" });
  const [_sortData, _setSortData] = useState({ field: null, order: "DESC" });
  const tabsData = [
    {
      title: "Overview",
      id: "overview",
      url: `/markets/top-india-investors-portfolio/${sharkSeoName},expertid-${sharkID}`,
    },
    {
      title: "Fresh Entry & Exit",
      id: "fresh-entry-exit",
      url: `/markets/top-india-investors-portfolio/${sharkSeoName},expertid-${sharkID}/fresh-entry-exit`,
    },
    {
      title: "Holdings",
      id: "holdings",
      url: `/markets/top-india-investors-portfolio/${sharkSeoName},expertid-${sharkID}/holdings`,
    },
    {
      title: "Change in Holdings",
      id: "change-in-holdings",
      url: `/markets/top-india-investors-portfolio/${sharkSeoName},expertid-${sharkID}/change-in-holdings`,
    },
    {
      title: "Bulk/Block Deals",
      id: "bulk-block-deals",
      url: `/markets/top-india-investors-portfolio/${sharkSeoName},expertid-${sharkID}/bulk-block-deals`,
    },
  ];
  console.log("client inhom epage data", {
    data,
    slug,
    pageData,
    title,
    arrayOfCompany,
    pageSummaryInfo,
  });

  const filterApiCall = async () => {
    const data = await fetchFilters({ all: true, marketcap: true });
    setFilterMenuData(data);
  };
  const showFilterMenu = (value: boolean) => {
    setShowFilter(value);
  };
  const handleChangeData = async (
    id: any,
    name: string,
    selectedTab: string,
  ) => {
    setShowFilter(false);
    //filterDataChange(id, name, selectedTab);
    const filter =
      id !== undefined && !isNaN(Number(id))
        ? parseInt(id)
        : id !== undefined
          ? id
          : 0;
    const __id = filter === 0 ? [] : [filter];
    const selectedFilter = await fetchSelectedFilter(filter);
    setNiftyFilterData(selectedFilter);
    setPayload({ ..._payload, filterValue: __id, pageNo: 1 });
  };
  const handlePageChangeHandler = (value: any) => {
    setPayload({ ..._payload, pageNo: value });
  };
  const callAPIforHoldingData = async () => {
    setTableLoadingShow(true);
    const invertorData = await commonPostAPIHandler(`BigBullHolding`, _payload);
    pageData = invertorData ? invertorData : "";
    const arrayOfCompany =
      pageData?.datainfo?.holdingsCompanyInfo?.holdingsStockData || [];
    const pageSummaryInfo =
      pageData?.datainfo?.holdingsCompanyInfo?.pageSummaryInfo || {};
    setTableLoadingShow(false);
    setArrayOfCompany(arrayOfCompany);
    setPageSummaryInfo(pageSummaryInfo);
  };
  const sortHandler = (key: any, orderBy: string) => {
    let sortOrder = "DESC";
    if (sortData.field === key) {
      sortOrder = sortData.order === "ASC" ? "DESC" : "ASC";
      setSortData({
        ...sortData,
        order: sortOrder,
      });
    } else {
      setSortData({ field: key, order: sortOrder });
    }
    handleSortServerSide(sortOrder, orderBy);
  };
  const handleSortServerSide = async (field: any, _orderBy: string) => {
    setPayload({ ..._payload, sortBy: _orderBy, orderBy: field, pageNo: 1 });
  };
  const callAPIforBulkBlockDealsData = async () => {
    // ==========
    setTableLoadingShow(true);
    const invertorData = await commonPostAPIHandler(
      `BigBullBulkBlockDeal`,
      _payload,
    );
    const pageData = invertorData ? invertorData : "";
    const arrayOfCompany =
      pageData?.datainfo?.bulkblockDealsInfo?.stockHoldingList || [];
    const pageSummaryInfo =
      pageData?.datainfo?.bulkblockDealsInfo?.pageSummaryInfo || {};
    setTableLoadingShow(false);
    setArrayOfCompany(arrayOfCompany);
    setPageSummaryInfo(pageSummaryInfo);
  };
  const callAPIforFreshEntryExitData = async () => {
    setTableLoadingShow(true);
    const invertorData = await commonPostAPIHandler(
      `BigBullFreshEntryExit`,
      _payload,
    );
    const pageData = invertorData ? invertorData : "";
    const arrayOfCompany =
      pageData?.datainfo?.entryExitDataInfo?.entryExitData
        ?.stockEntryExitData || [];
    const pageSummaryInfo =
      pageData?.datainfo?.entryExitDataInfo?.pageSummaryInfo || {};
    setTableLoadingShow(false);
    setArrayOfCompany(arrayOfCompany);
    setPageSummaryInfo(pageSummaryInfo);
  };
  const callAPIforChangeInHoldingsData = async () => {
    setTableLoadingShow(true);
    const invertorData = await commonPostAPIHandler(
      `BigBullHoldingChanges`,
      _payload,
    );
    const pageData = invertorData ? invertorData : "";
    const arrayOfCompany =
      pageData?.datainfo?.stockIncreaseDecreaseDataInfo
        ?.stockIncreaseDecreaseListData || [];
    const pageSummaryInfo =
      pageData?.datainfo?.stockIncreaseDecreaseDataInfo?.pageSummaryInfo || {};
    setTableLoadingShow(false);
    setArrayOfCompany(arrayOfCompany);
    setPageSummaryInfo(pageSummaryInfo);
  };
  const sortByTradeHandler = (sortData: any) => {
    setSortByTradeActive(sortData);
    setPayload({ ..._payload, tradType: sortData.value, pageNo: 1 });
  };
  const sortBychangeHoldingHandler = (sortData: any) => {
    setSortByChangeHoldingActive(sortData);
    setPayload({ ..._payload, tradType: sortData.value, pageNo: 1 });
  };
  useEffect(() => {
    console.log("payload are changed. ", _payload);
    if (slug === "holdings") {
      callAPIforHoldingData();
    }
    if (slug === "bulk-block-deals") {
      callAPIforBulkBlockDealsData();
    }
    if (slug === "fresh-entry-exit") {
      callAPIforFreshEntryExitData();
    }
    if (slug === "change-in-holdings") {
      callAPIforChangeInHoldingsData();
    }
  }, [_payload]);
  useEffect(() => {
    if (slug === "holdings") {
      filterApiCall();
    }
  }, []);
  return (
    <>
      <HeroBanner data={data} />
      <InvestorsTopTabs
        data={tabsData}
        rightTabTxt="As on Quarter: Dec, 2023"
        activeTab=""
      />
      <div className={styles.mainContentWraper}>
        <div className={styles.topHeadNavSec}>
          <h1 className={styles.head1}>{title}</h1>
          {slug === "holdings" ? (
            <>
              <span
                className={`${styles.roundBtn} ${styles.filterNseBse}`}
                onClick={() => showFilterMenu(true)}
              >
                <i className={`eticon_filter ${styles.mr}`}></i>{" "}
                {niftyFilterData?.name}
              </span>
            </>
          ) : (
            ""
          )}
          {slug === "fresh-entry-exit" ? (
            <>
              <div className={`${styles.sortFilter}`}>
                <span className={styles.stTxt}>Sort By: </span>
                <span className={styles.dyTxt}> {sortByTradeActive.label}</span>
                <div className={styles.sortFilterContent}>
                  <div className={`moduleBody ${styles.body}`}>
                    <ul>
                      {sortByTrade.map((sort: any, index: number) => {
                        return (
                          <li
                            onClick={() => sortByTradeHandler(sort)}
                            className={`${sortByTradeActive.value === sort.value ? styles.active : ""}`}
                            key={`${index}-${sort.value}`}
                          >
                            {sort.label}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            ""
          )}

          {slug === "change-in-holdings" ? (
            <>
              <div className={`${styles.sortFilter}`}>
                <span className={styles.stTxt}>Sort By: </span>
                <span className={styles.dyTxt}>
                  {" "}
                  {sortByChangeHoldingActive.label}
                </span>
                <div className={styles.sortFilterContent}>
                  <div className={`moduleBody ${styles.body}`}>
                    <ul>
                      {sortByChangeHolding.map((sort: any, index: number) => {
                        return (
                          <li
                            onClick={() => sortBychangeHoldingHandler(sort)}
                            className={`${sortByChangeHoldingActive.value === sort.value ? styles.active : ""}`}
                            key={`${index}-${sort.value}-`}
                          >
                            {sort.label}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </div>

        {slug === "fresh-entry-exit" && (
          <FreshEntryCard cardData={_arrayOfCompany} />
        )}
        {slug === "holdings" && (
          <InvestorCatModule
            tableData={_arrayOfCompany}
            tableHead={tableHead}
            sortData={sortData}
            handleSort={sortHandler}
            shouldShowLoader={tableLoadingShow}
            pageType={slug}
            pagination={_pageSummaryInfo}
            paginationLastNode=" Holdings"
            handlePageChange={handlePageChangeHandler}
          />
        )}
        {slug === "change-in-holdings" && (
          <FreshEntryCard cardData={_arrayOfCompany} />
        )}
        {slug === "bulk-block-deals" && (
          <InvestorCatModule
            tableData={_arrayOfCompany}
            tableHead={tableHead}
            sortData={sortData}
            handleSort={sortHandler}
            shouldShowLoader={tableLoadingShow}
            pageType={slug}
            pagination={_pageSummaryInfo}
            paginationLastNode=" bluk block deals"
            handlePageChange={handlePageChangeHandler}
          />
        )}
      </div>
      {showFilter && (
        <StockFilterNifty
          data={filterMenuData}
          onclick={showFilterMenu}
          showFilter={showFilter}
          valuechange={handleChangeData}
          selectTab={niftyFilterData.exchange}
          childMenuTabActive={niftyFilterData.indexId}
        />
      )}
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: slug, redirectUrl: "" }]}
      />
    </>
  );
};

export default InvestorClientCatePage;
