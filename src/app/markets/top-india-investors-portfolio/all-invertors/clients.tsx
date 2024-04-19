"use client";
import { useState } from "react";
import Link from "next/link";
import { fetchSelectedFilter } from "@/utils/utility";
import BigBullTableCard from "../../../../components/BigBullTableCard";
import BigBullTabs from "../../../../components/BigBullTabs";

const tabs = [
  {
    title: "Overview",
    id: "overview",
    url: "/markets/top-india-investors-portfolio",
  },
  {
    title: "All Investors",
    id: "allInvestors",
    url: "/markets/top-india-investors-portfolio/all-invertors",
  },
  {
    title: "Qtr. Changes",
    id: "qtrChanges",
    url: "/markets/top-india-investors-portfolio/qtr-changes",
  },
  {
    title: "Recent Transactions",
    id: "recentTransactions",
    url: "/markets/top-india-investors-portfolio/recent-transactions",
  },
  {
    title: "Best Picks",
    id: "bestPicks",
    url: "/markets/top-india-investors-portfolio/best-picks",
  },
  {
    title: "Most Held",
    id: "mostHeld",
    url: "/markets/top-india-investors-portfolio/most-held",
  },
];

const BigBullAllInvertorsPageClientPage = ({
  data,
  selectedFilter,
  tableData,
  tableHead,
  pagination,
}: any) => {
  console.log("___data", data, selectedFilter);
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const [_tableData, setTableData] = useState(tableData);
  const [_tableHead, setTableHead] = useState(tableHead);
  const [_pagination, setPagination] = useState(pagination);
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
  return (
    <>
      <BigBullTabs data={tabs} />
      <BigBullTableCard
        tableData={_tableData}
        tableHead={_tableHead}
        pagination={_pagination}
        niftyFilterData={niftyFilterData}
        filterDataChange={filterDataChangeHander}
      />
    </>
  );
};

export default BigBullAllInvertorsPageClientPage;
