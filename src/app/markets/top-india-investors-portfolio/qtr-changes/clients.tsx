"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchSelectedFilter } from "@/utils/utility";
import BigBullTableCard from "../../../../components/BigBullTableCard";
import BigBullTabs from "../../../../components/BigBullTabs";
import tabsJson from "../../../../DataJson/bigbullTabs.json";
import indiFilter from "../../../../DataJson/individualFilter.json";

const tabs = tabsJson;
const individualFilter = indiFilter;

const BigBullQtrChangesPageClientPage = ({
  data,
  selectedFilter,
  tableData,
  tableHead,
  pagination,
}: any) => {
  console.log("___data", data, selectedFilter);
  const [aciveFilter, setActiveFilter] = useState("INDIVIDUAL");
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
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const [_tableData, setTableData] = useState(tableData);
  const [_tableHead, setTableHead] = useState(tableHead);
  const [_pagination, setPagination] = useState(pagination);
  const callAPIfitler = () => {
    // ====
  };

  const filterDataChangeHander = async (id: any) => {
    const filter =
      id !== undefined && !isNaN(Number(id))
        ? parseInt(id)
        : id !== undefined
          ? id
          : 0;
    const selectedFilter = await fetchSelectedFilter(filter);
    setNiftyFilterData(selectedFilter);
  };
  useEffect(() => {
    callAPIfitler();
  }, [aciveFilter]);
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
      />
    </>
  );
};

export default BigBullQtrChangesPageClientPage;
