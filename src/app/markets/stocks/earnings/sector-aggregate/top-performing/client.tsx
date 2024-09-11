"use client";
import { useState } from "react";

import HeroBanner from "@/components/StocksEarnings/HeroBanner";
import LinkTabs from "@/components/StocksEarnings/LinkTabs";
import SectorPageCard from "@/components/StocksEarnings/SectorPageCard";

const SectorAggregatesClintPage = ({ data, selectedFilter }: any) => {
  const _title = "Sector Aggregates";
  const _desc = `Discover the latest declared earnings results of all companies with a comprehensive day-by-day view. Easily search for individual stocks and apply filters to refine your search. Track Sales & Profit gainers and losers separately, providing a quick overview of performance trends. Get a clear and focused view of top and bottom performers, making it easy to spot key shifts in market dynamics`;
  const [sortingValue, setSortingValue] = useState("sectorNetSalesYoyAvg");
  const [sortingLabel, setSortingLabel] = useState("Net Profit YoY");
  const sortHandlerFun = (sortData: any) => {
    setSortingValue(sortData?.value);
    setSortingLabel(sortData?.title);
  };
  //console.log("_data_", data);
  return (
    <>
      <HeroBanner title={_title} desc={_desc} />
      <LinkTabs
        sorting="yes"
        sortingValue={sortingValue}
        sortHandlerFun={sortHandlerFun}
        sortingLabel={sortingLabel}
      />
      <SectorPageCard
        data={data}
        tpName="top-performing"
        sortingValue={sortingValue}
      />
    </>
  );
};

export default SectorAggregatesClintPage;
