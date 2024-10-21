"use client";
import { useState } from "react";

import HeroBanner from "@/components/StocksEarnings/HeroBanner";
import LinkTabs from "@/components/StocksEarnings/LinkTabs";
import SectorPageCard from "@/components/StocksEarnings/SectorPageCard";

const SectorAggregatesUnderPerformingClient = ({ data }: any) => {
  const _title = "Sector Aggregates";
  const _desc = ``;
  const [sortingValue, setSortingValue] = useState("sectorPATYoyAvg");
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
        tpName="under-performing"
        sortingValue={sortingValue}
      />
    </>
  );
};

export default SectorAggregatesUnderPerformingClient;
