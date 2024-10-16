"use client";
import React, { useState, useEffect, useRef } from "react";
import { getFiiDiiData, getFiiDiiSummaryData } from "@/utils/utility";
import PageHeaderSection from "@/components/PageHeader";
import CardsList from "@/components/CorporateAnnouncements/Card";

const CorporateAnnouncementsClient = () => {
  return (
    <>
      <CardsList />
      {/* <MarketTable
        data={tableData}
        setFallbackWebsocket={false}
        tableHeaders={tableHeaderData}
      /> */}
    </>
  );
};

export default CorporateAnnouncementsClient;
