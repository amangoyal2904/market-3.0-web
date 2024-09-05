"use client";
import { useState } from "react";

import HeroBanner from "@/components/StocksEarnings/HeroBanner";
import LinkTabs from "@/components/StocksEarnings/LinkTabs";
import SectorPageCard from "@/components/StocksEarnings/SectorPageCard";

const SectorAggregatesUnderPerformingClient = ({ data }: any) => {
  const _title = "Sector Aggregates";
  const _desc = `A quarterly report is a summary or collection of unaudited financial statements, such as balance sheets, income statements, and cash flow statements, issued by companies every quarter (three months). The quarterly reports and financial statements indicate the business's quarterly development. To protect the interests of investors, SEBI (Securities and Exchange Board of India) requires every listed firm to produce quarterly reports.`;

  console.log("_data_", data);
  return (
    <>
      <HeroBanner title={_title} desc={_desc} />
      <LinkTabs />
      <SectorPageCard data={data} tpName="under-performing" />
    </>
  );
};

export default SectorAggregatesUnderPerformingClient;
