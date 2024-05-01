"use client";
import React, { useState, useEffect } from "react";
import FiiDiiHeader from "@/components/FIIDII/Header";
import FiiDiiOtherTable from "@/components/FIIDII/OtherTable";
import FiiDiiTabs from "@/components/FIIDII/Tabs";
import {
  getCashData,
  getFandOCashData,
  getFiiCashData,
  getMfCashData,
} from "@/utils/utility";

interface FiiDiiActivitySubPagesClientsProps {
  listData: any;
  type: string;
}

const FiiDiiActivitySubPagesClients: React.FC<
  FiiDiiActivitySubPagesClientsProps
> = ({ listData, type }) => {
  const [tableData, setTableData] = useState<any[]>(listData);
  const [filterType, setFilterType] = useState<string>("daily");
  const [apiType, setApiType] = useState<string>("index");

  useEffect(() => {
    fetchData(type);
  }, [filterType, apiType]);

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

  const typeToFunctionMap: {
    [key: string]: (filterType: string, apiType: string) => Promise<any>;
  } = {
    "cash-provisional": getCashData,
    "fii-cash": getFiiCashData,
    "fii-fno": getFandOCashData,
    "mf-cash": getMfCashData,
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
      <FiiDiiOtherTable
        type={type}
        otherData={tableData}
        handleFilterType={onFilterChange}
      />
    </>
  );
};

export default FiiDiiActivitySubPagesClients;
