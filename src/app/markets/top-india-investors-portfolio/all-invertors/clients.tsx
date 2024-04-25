"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchSelectedFilter } from "@/utils/utility";
import BigBullTableCard from "../../../../components/BigBullTableCard";
import BigBullTabs from "../../../../components/BigBullTabs";
import tabsJson from "../../../../DataJson/bigbullTabs.json";
import indiFilter from "../../../../DataJson/individualFilter.json";
import { fetchGetCommonAPI } from "../../../../utils/bigbull";
import { commonPostAPIHandler } from "../../../../utils/screeners";
const tabs = tabsJson;
const individualFilter = indiFilter;

const BigBullAllInvertorsPageClientPage = ({
  tableData,
  tableHead,
  pagination,
}: any) => {
  const __title =
    "Individual Investors (Data Updated for Mar’24 Qtr. where available)";
  //console.log("___data", tableHead, tableData);
  const [aciveFilter, setActiveFilter] = useState("INDIVIDUAL");
  const [invstrQuery, setInvstrQuery] = useState("");
  const [_tableData, setTableData] = useState(tableData);
  const [_tableHead, setTableHead] = useState(tableHead);
  const [_pagination, setPagination] = useState(pagination);
  const [sortData, setSortData] = useState({ field: null, order: "DESC" });
  const [_sortData, _setSortData] = useState({ field: null, order: "DESC" });
  const [tableLoadingShow, setTableLoadingShow] = useState(false);
  const [_payload, setPayload] = useState({
    ssoId: "",
    investorType: "INDIVIDUAL",
    sortBy: "networth",
    orderBy: "DESC",
    primeFlag: 1,
    pageSize: 10,
    pageNo: 1,
  });
  const fitlerHandler = (value: any) => {
    setActiveFilter(value);
    setPayload({ ..._payload, investorType: value, pageNo: 1 });
  };
  const invstrQueryHandler = (value: any) => {
    setInvstrQuery(value);
  };

  const tableAPICall = async () => {
    setTableLoadingShow(true);
    const _data = await commonPostAPIHandler(
      `BigBullGetInvestorList`,
      _payload,
    );
    const __tableData: any[] =
      _data?.datainfo?.investorlist?.investorData || [];
    const __pagination = _data?.datainfo?.investorlist?.pageSummaryInfo || {};
    setTableData(__tableData);
    setPagination(__pagination);
    //console.log({_data})
    setTableLoadingShow(false);
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
  //console.log(_payload)
  const searchAPIcallForInstr = async () => {
    // === filter calll for search api call
    const getData = await fetchGetCommonAPI({
      type: `BigBullGetSearchData`,
      searchParam: `?searchtext=${invstrQuery}&limit=10&investortype=${aciveFilter}`,
      ssoid: "",
    });
    //console.log("____data", getData);
  };
  const handlePageChangeHandler = (value: any) => {
    setPayload({ ..._payload, pageNo: value });
  };

  useEffect(() => {
    if (invstrQuery && invstrQuery !== "" && invstrQuery.length > 3) {
      searchAPIcallForInstr();
    }
  }, [invstrQuery]);
  useEffect(() => {
    //console.log('___payload change ', _payload);
    tableAPICall();
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
        searchInvestor={true}
        invstrQuery={invstrQuery}
        invstrQueryHandler={invstrQueryHandler}
        sortData={sortData}
        handleSort={sortHandler}
        handlePageChange={handlePageChangeHandler}
        shouldShowLoader={tableLoadingShow}
        title={__title}
        paginationLastNode="Investors"
      />
    </>
  );
};

export default BigBullAllInvertorsPageClientPage;
