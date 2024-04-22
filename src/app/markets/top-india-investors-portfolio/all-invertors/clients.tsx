"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchSelectedFilter } from "@/utils/utility";
import BigBullTableCard from "../../../../components/BigBullTableCard";
import BigBullTabs from "../../../../components/BigBullTabs";
import tabsJson from "../../../../DataJson/bigbullTabs.json";
import indiFilter from "../../../../DataJson/individualFilter.json";
import { fetchGetCommonAPI } from "../../../../utils/bigbull";
const tabs = tabsJson;
const individualFilter = indiFilter;

const BigBullAllInvertorsPageClientPage = ({
  tableData,
  tableHead,
  pagination,
}: any) => {
  //console.log("___data", data, selectedFilter);
  const [aciveFilter, setActiveFilter] = useState("INDIVIDUAL");
  const [invstrQuery, setInvstrQuery] = useState("");
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
  };
  const invstrQueryHandler = (value: any) => {
    setInvstrQuery(value);
  };
  const [_tableData, setTableData] = useState(tableData);
  const [_tableHead, setTableHead] = useState(tableHead);
  const [_pagination, setPagination] = useState(pagination);
  const callAPIfitler = () => {
    // ====
  };
  const searchAPIcallForInstr = async () => {
    // === fjhere calll for search api call
    const getData = await fetchGetCommonAPI({
      type: `BigBullGetSearchData`,
      searchParam: `?searchtext=${invstrQuery}&limit=10&investortype=${aciveFilter}`,
      ssoid: "",
    });
    console.log("____data", getData);
  };

  useEffect(() => {
    callAPIfitler();
  }, [aciveFilter]);
  useEffect(() => {
    if (invstrQuery && invstrQuery !== "" && invstrQuery.length > 3) {
      searchAPIcallForInstr();
    }
  }, [invstrQuery]);
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
      />
    </>
  );
};

export default BigBullAllInvertorsPageClientPage;
