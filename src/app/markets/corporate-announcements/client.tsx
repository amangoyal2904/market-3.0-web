"use client";
import React, { useState, useEffect, useRef } from "react";
import { getFiiDiiData, getFiiDiiSummaryData } from "@/utils/utility";
import CardsList from "@/components/CorporateAnnouncements/Card";
import _data from "./Data.json";
import CorporateAnnouncementFilters from "@/components/CorporateAnnouncements/Filters";

const CorporateAnnouncementsClient = () => {
  return (
    <>
      <CorporateAnnouncementFilters />
      <CardsList listData={_data} />
      {/* <MarketTable
        data={tableData}
        setFallbackWebsocket={false}
        tableHeaders={tableHeaderData}
      /> */}
    </>
  );
};

export default CorporateAnnouncementsClient;
