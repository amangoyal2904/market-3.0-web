"use client";
import React, { useState, useEffect, useRef } from "react";
import FiiDiiHeader from "@/components/FIIDII/Header";
import FiiDiiOtherTable from "@/components/FIIDII/OtherTable";
import FiiDiiTabs from "@/components/FIIDII/Tabs";
import {
  getCashData,
  getFandOCashData,
  getFiiCashData,
  getFiiDiiSummaryData,
  getMfCashData,
} from "@/utils/utility";
import FiiDiiSummary from "@/components/FIIDII/FiiDiiSummary";

interface FiiDiiActivitySubPagesClientsProps {
  summaryData: any;
  listData: any;
  type: string;
}

const typeToFunctionMap: {
  [key: string]: (filterType: string, apiType: string) => Promise<any>;
} = {
  "cash-provisional": getCashData,
  "fii-cash": getFiiCashData,
  "fii-fno": getFandOCashData,
  "mf-cash": getMfCashData,
};

const typeToSummaryParamMap: { [key: string]: string } = {
  cash: "cash",
  index: "foindex",
  stock: "fostock",
};

const FiiDiiActivitySubPagesClients: React.FC<
  FiiDiiActivitySubPagesClientsProps
> = ({ listData, summaryData, type }) => {
  const [tableData, setTableData] = useState<any[]>(listData);
  const [summary, setSummary] = useState(summaryData);
  const [filterType, setFilterType] = useState<string>("daily");
  const [apiType, setApiType] = useState<string>("index");

  const prevApiType = useRef<string>(apiType);

  useEffect(() => {
    fetchData(type);
    if (prevApiType.current !== apiType) {
      fetchSummaryData();
    }
    prevApiType.current = apiType;
  }, [filterType, apiType]);

  const fetchSummaryData = async () => {
    try {
      const summaryParam = typeToSummaryParamMap[apiType];
      const summaryResponse: any = await getFiiDiiSummaryData(summaryParam);
      setSummary(summaryResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async (type: string) => {
    try {
      const responseGetter = typeToFunctionMap[type];
      if (responseGetter) {
        const response: any = await responseGetter(filterType, apiType);
        const { listData } = response.datainfo.data;
        setTableData(listData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onFilterChange = (filterType: string) => {
    setFilterType(filterType);
  };

  const onApiTypeChange = (apiType: string) => {
    setApiType(apiType);
  };

  return (
    <>
      <FiiDiiHeader />
      <FiiDiiTabs activeTab={type} handleApiType={onApiTypeChange} />
      <FiiDiiSummary summaryData={summary} />
      <FiiDiiOtherTable
        type={type}
        otherData={tableData}
        handleFilterType={onFilterChange}
      />
    </>
  );
};

export default FiiDiiActivitySubPagesClients;
