"use client";
import { useState } from "react";

import StockHeroBanner from "@/components/StocksEarnings/StockHeroBanner";
import StockEarningsTables from "@/components/StocksEarnings/StockEarningsTables";
import AdInfo from "@/components/Ad/AdInfo/homeAds.json";
import DfpAds from "@/components/Ad/DfpAds";
import LatestResultNewsSec from "@/components/StocksEarnings/LatestResultNewsSec";
import OtherSectors from "@/components/StocksEarnings/OtherSectors";
import FAQSector from "@/components/StocksEarnings/FAQSector";

const SectorPageClient = ({
  data,
  tabData,
  activeViewId,
  tableHeaderData,
  pageSummary,
  payload,
  unixDateTime,
  tableData,
}: any) => {
  const _title = data?.sectorSummary?.sectorAggregateData[0]?.sectorName || "";
  const _desc = data?.faq?.sectorDescription || "";
  //console.log("_data_");
  return (
    <>
      <StockHeroBanner summaryData={data?.sectorSummary} desc={_desc} />
      <StockEarningsTables
        tableData={tableData}
        activeViewId={activeViewId}
        title={_title}
        tabData={tabData}
        tableHeaderData={tableHeaderData}
        pageSummary={pageSummary}
        payload={payload}
        unixDateTime={unixDateTime}
      />
      <DfpAds adInfo={AdInfo.dfp.mid2} />

      <LatestResultNewsSec
        newsTitle="Sectors News"
        viewTxt="View all News Updates"
        viewUrl="https://economictimes.indiatimes.com/markets/stocks/earnings/news"
        type="earningSector"
        topNewsData={data?.topNewsData}
      />
      <OtherSectors
        title="Other Sectors"
        viewTxt="View Other Sectors"
        viewUrl="/markets/stocks/earnings/sector-aggregate/top-performing"
        data={data?.otherSectorData}
      />
      <FAQSector data={data?.faq?.sectorFaq} />
    </>
  );
};

export default SectorPageClient;
