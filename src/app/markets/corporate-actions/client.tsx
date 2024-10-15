"use client";
import CorporateActionseHeader from "@/components/CorporateActions/Header";
import CorporateActionseTabs from "@/components/CorporateActions/Tabs";
import { getFiiDiiSummaryData } from "@/utils/utility";
import React, { useEffect, useRef, useState } from "react";

const typeToSummaryParamMap: { [key: string]: string } = {
  FIIDIICash: "cash",
  IndexFandO: "foindex",
  FIIDIIStockFAndO: "fostock",
};

const CorporateActionClient = ({
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
      <CorporateActionseHeader />
      <CorporateActionseTabs
        activeTab="dividend"
        handleApiType={onApiTypeChange}
      />
    </>
  );
};

export default CorporateActionClient;
