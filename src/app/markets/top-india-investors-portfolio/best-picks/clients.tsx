"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchSelectedFilter } from "@/utils/utility";
import BigBullTableCard from "../../../../components/BigBullTableCard";
import BigBullTabs from "../../../../components/BigBullTabs";
import tabsJson from "../../../../DataJson/bigbullTabs.json";
import indiFilter from "../../../../DataJson/individualFilter.json";
import { commonPostAPIHandler } from "../../../../utils/screeners";

const tabs = tabsJson;
const individualFilter = indiFilter;

const BigBullBestPicksPageClientPage = ({
  selectedFilter,
  tableData,
  tableHead,
  pagination,
}: any) => {
  console.log({
    selectedFilter,
    tableData,
    tableHead,
    pagination,
  });
  const __title = "Investors Best Picks";
  const pageType = "bestPicks";
  const [aciveFilter, setActiveFilter] = useState("INDIVIDUAL");
  const [_payload, setPayload]: any = useState({
    ssoId: "",
    primeFlag: 1,
    investorType: "INDIVIDUAL",
    position: "All",
    filterType: "index",
    filterValue: [],
    sortBy: "3MReturns",
    orderBy: "DESC",
    pageNo: 1,
    pageSize: 10,
  });
  const fitlerHandler = (value: any) => {
    setActiveFilter(value);
    setPayload({ ..._payload, investorType: value, pageNo: 1 });
  };
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const [_tableData, setTableData] = useState(tableData);
  const [_tableHead, setTableHead] = useState(tableHead);
  const [_pagination, setPagination] = useState(pagination);
  const [sortData, setSortData] = useState({ field: null, order: "DESC" });
  const [_sortData, _setSortData] = useState({ field: null, order: "DESC" });
  const [tableLoadingShow, setTableLoadingShow] = useState(false);
  const callAPIfitler = async () => {
    setTableLoadingShow(true);
    console.log("__payload", _payload);
    const allData = await commonPostAPIHandler(`BigBullGetBestPicks`, _payload);
    const __tableData: any[] =
      allData?.datainfo?.bestPicksDataInfo?.bestPicksListInfo || [];
    const __pagination =
      allData?.datainfo?.bestPicksDataInfo?.pageSummaryInfo || {};
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
    const __id = filter === 0 ? [] : [filter];
    const selectedFilter = await fetchSelectedFilter(filter);
    setNiftyFilterData(selectedFilter);
    setPayload({ ..._payload, filterValue: __id, pageNo: 1 });
  };
  const handlePageChangeHandler = (value: any) => {
    setPayload({ ..._payload, pageNo: value });
  };
  useEffect(() => {
    callAPIfitler();
  }, [_payload]);
  return (
    <>
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
        paginationLastNode="Best Picks"
      />
    </>
  );
};

export default BigBullBestPicksPageClientPage;
