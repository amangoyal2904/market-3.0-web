"use client";
import FIIDIIChart from "@/components/FIIDII/FIIDIIChart";
import FiiDiiHeader from "@/components/FIIDII/Header";
import FiiDiiActivityOverviewTable from "@/components/FIIDII/OverviewTables";
import FiiDiiTabs from "@/components/FIIDII/Tabs";
import React, { useState } from "react";

const FiiDiiActivityclient = ({ dataWithNiftySensex, otherData }: any) => {
  const [apiType, setApiType] = useState("FIIDIICash");

  const onApiTypeChange = (type: string) => {
    setApiType(type);
  };

  return (
    <>
      <FiiDiiHeader />
      <FiiDiiTabs activeTab="overview" handleApiType={onApiTypeChange} />
      <FIIDIIChart apiType={apiType} />
      <FiiDiiActivityOverviewTable
        dataWithNiftySensex={dataWithNiftySensex}
        otherData={otherData}
      />
    </>
  );
};

export default FiiDiiActivityclient;
