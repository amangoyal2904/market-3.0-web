"use client";
import FIIDIIChart from "@/components/FIIDII/FIIDIIChart";
import FiiDiiSummary from "@/components/FIIDII/FiiDiiSummary";
import FiiDiiHeader from "@/components/FIIDII/Header";
import FiiDiiActivityOverviewTable from "@/components/FIIDII/OverviewTables";
import FiiDiiTabs from "@/components/FIIDII/Tabs";
import { getFiiDiiSummaryData } from "@/utils/utility";
import React, { useEffect, useRef, useState } from "react";

const typeToSummaryParamMap: { [key: string]: string } = {
  FIIDIICash: "cash",
  IndexFandO: "foindex",
  FIIDIIStockFAndO: "fostock",
};

const FiiDiiActivityclient = ({
  dataWithNiftySensex,
  otherData,
  summaryData,
}: any) => {
  const [apiType, setApiType] = useState("FIIDIICash");
  const [summary, setSummary] = useState(summaryData);

  const prevApiType = useRef<string>(apiType);

  const fetchSummaryData = async () => {
    try {
      const summaryParam = typeToSummaryParamMap[apiType];
      const summaryResponse: any = await getFiiDiiSummaryData(summaryParam);
      setSummary(summaryResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onApiTypeChange = (type: string) => {
    setApiType(type);
  };

  useEffect(() => {
    if (prevApiType.current !== apiType) {
      fetchSummaryData();
    }
    prevApiType.current = apiType;
  }, [apiType]);

  return (
    <>
      <FiiDiiHeader />
      <FiiDiiTabs activeTab="overview" handleApiType={onApiTypeChange} />
      <FiiDiiSummary
        summaryData={summary}
        type={typeToSummaryParamMap[apiType]}
      />
      <FIIDIIChart apiType={apiType} />
      <FiiDiiActivityOverviewTable
        dataWithNiftySensex={dataWithNiftySensex}
        otherData={otherData}
      />
    </>
  );
};

export default FiiDiiActivityclient;
