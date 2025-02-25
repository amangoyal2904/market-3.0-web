"use client";
import styles from "./style.module.scss";
import { useState, useEffect } from "react";
import { fetchSelectedFilter, getBigbullTopTabData } from "@/utils/utility";
import BigBullTableCard from "../../../components/BigBullTableCard";
import BigBullTabs from "../../../components/BigBullTabs";

import indiFilter from "../../../DataJson/individualFilter.json";
import { commonPostAPIHandler } from "../../../utils/screeners";
import { useRouter } from "next/navigation";
import BreadCrumb from "@/components/BreadCrumb";
import DfpAds from "@/components/Ad/DfpAds";
import AdInfo from "@/components/Ad/AdInfo/marketstatsAds.json";
import { getCookie } from "@/utils";

const individualFilter = indiFilter;

const BigBullRecentTransactionsClientPage = ({
  selectedFilter,
  tableData,
  tableHead,
  pagination,
  payload,
  pageUrl,
  tableThSortFilterID,
}: any) => {
  const router = useRouter();
  const ssoid = getCookie("ssoid") || "";
  const ticketId = getCookie("TicketId") || "";
  const __title = "Investors Recent Transactions";
  const pageType = "recentTransactions";
  const [aciveFilter, setActiveFilter] = useState(payload.investorType);
  const [_payload, setPayload]: any = useState(payload);
  const fitlerHandler = (value: any) => {
    const pushValue = value.toLowerCase();
    router.push(
      `/markets/top-india-investors-portfolio/${pushValue}/recent-transactions`,
    );
  };
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const [_tableData, setTableData] = useState(tableData);
  const [_tableHead, setTableHead] = useState(tableHead);
  const [_pagination, setPagination] = useState(pagination);
  const [sortData, setSortData] = useState({
    field: tableThSortFilterID,
    order: "DESC",
  });
  const [_sortData, _setSortData] = useState({
    field: tableThSortFilterID,
    order: "DESC",
  });
  const [sortByTimeActive, setSortByTimeActive] = useState({
    label: "Last 1 Year",
    value: "1Y",
  });
  const [sortByActive, setSortByActive]: any = useState([
    { label: "Today", value: "1D" },
    { label: "Last 3 Days", value: "3D" },
    { label: "Last 1 week", value: "7D" },
    { label: "Last 30 Days", value: "30D" },
    { label: "Last 3 Months", value: "3M" },
    { label: "Last 1 Year", value: "1Y" },
  ]);
  const [tableLoadingShow, setTableLoadingShow] = useState(false);
  const tabCatName = _payload.investorType.toLowerCase();
  const sortByActiveHandler = (sortData: any) => {
    setSortByTimeActive(sortData);
    setPayload({ ..._payload, timeSpan: sortData.value, pageNo: 1 });
  };
  const tabs = getBigbullTopTabData(tabCatName);
  const callAPIfitler = async () => {
    setTableLoadingShow(true);
    console.log("__payload", _payload);
    const allData = await commonPostAPIHandler(
      `BigBullGetRecentTransactions`,
      _payload,
      ssoid,
      ticketId,
    );
    const __tableData: any[] =
      allData?.datainfo?.recentDealsInfo?.listRecentDeals || [];
    const __pagination =
      allData?.datainfo?.recentDealsInfo?.pageSummaryInfo || {};
    setTableData(__tableData);
    setPagination(__pagination);
    setTableLoadingShow(false);
    console.log("data", allData);
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
  const filterDataChangeHander = async (id: any) => {
    const filter =
      id !== undefined && !isNaN(Number(id))
        ? parseInt(id)
        : id !== undefined
          ? id
          : 0;
    const __id = filter === 0 || filter === "watchlist" ? [] : [filter];
    const __filterType =
      filter === "watchlist"
        ? "watchlist"
        : filter == undefined || !isNaN(Number(filter))
          ? "index"
          : "marketcap";
    const selectedFilter = await fetchSelectedFilter(filter);
    setNiftyFilterData(selectedFilter);
    setPayload({
      ..._payload,
      filterValue: __id,
      pageNo: 1,
      filterType: __filterType,
    });
  };
  const handlePageChangeHandler = (value: any) => {
    setPayload({ ..._payload, pageNo: value });
  };
  useEffect(() => {
    callAPIfitler();
  }, [_payload]);
  return (
    <>
      <div className={`${styles.wraper} ${styles.mbfbrdc}`}>
        <div className={styles.topSec}>
          <h1 className={`heading ${styles.head}`}>
            <span className={styles.etprimeLogo}>ETPrime</span>
            <span className={styles.bigLogo}>Big</span>
            <span className={styles.bullTxt}>Bull Portfolio</span>
          </h1>
          <p className={styles.desc}>
            Get to know where the market gurus invest to grow your portfolio.
          </p>
        </div>
        <BigBullTabs
          data={tabs}
          individualFilter={individualFilter}
          aciveFilter={aciveFilter}
          fitlerHandler={fitlerHandler}
        />
        <BigBullTableCard
          tableData={_tableData}
          tableHead={_tableHead}
          pagination={_pagination}
          niftyFilterData={niftyFilterData}
          filterDataChange={filterDataChangeHander}
          niftyFilter={true}
          sortData={sortData}
          handleSort={sortHandler}
          handlePageChange={handlePageChangeHandler}
          shouldShowLoader={tableLoadingShow}
          title={__title}
          pageType={pageType}
          paginationLastNode="Recent Transactions"
          sortByTimeActive={sortByTimeActive}
          sortByActive={sortByActive}
          sortByActiveHandler={sortByActiveHandler}
        />
      </div>
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Recent Transactions", redirectUrl: "" }]}
      />
      <br />
      <DfpAds adInfo={AdInfo.dfp.btfAd} />
    </>
  );
};

export default BigBullRecentTransactionsClientPage;
