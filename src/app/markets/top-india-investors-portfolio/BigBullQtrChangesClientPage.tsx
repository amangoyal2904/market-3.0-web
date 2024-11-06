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

const BigBullQtrChangesClientPage = ({
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
  const __title = "Qtr. Changes in Holdings from Last Quarters";
  const pageType = "qtrChanges";
  const [aciveFilter, setActiveFilter] = useState(payload.investorType);
  const [_payload, setPayload]: any = useState(payload);
  const fitlerHandler = (value: any) => {
    const pushValue = value.toLowerCase();
    router.push(
      `/markets/top-india-investors-portfolio/${pushValue}/qtr-changes`,
    );
  };
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const [_tableData, setTableData] = useState(tableData);
  const [_tableHead, setTableHead] = useState(tableHead);
  const [_pagination, setPagination] = useState(pagination);
  const [sortData, setSortData] = useState({
    field: tableThSortFilterID,
    order: payload.orderBy,
  });
  const [_sortData, _setSortData] = useState({
    field: tableThSortFilterID,
    order: payload.orderBy,
  });
  const [tableLoadingShow, setTableLoadingShow] = useState(false);
  const tabCatName = _payload.investorType.toLowerCase();
  const tabs = getBigbullTopTabData(tabCatName);
  const callAPIfitler = async () => {
    setTableLoadingShow(true);
    console.log("__payload", _payload);
    const allData = await commonPostAPIHandler(
      `BigBullGetLastQuarter`,
      _payload,
      ssoid,
      ticketId,
    );
    const __tableData: any[] =
      allData?.datainfo?.investorKeyChanges?.investorKeyChangesData || [];
    const __pagination =
      allData?.datainfo?.investorKeyChanges?.pageSummaryInfo || {};
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
          paginationLastNode="Last Quarters Changes"
        />
      </div>
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Qtr Changes", redirectUrl: "" }]}
      />
      <br />
      <DfpAds adInfo={AdInfo.dfp.btfAd} />
    </>
  );
};

export default BigBullQtrChangesClientPage;
