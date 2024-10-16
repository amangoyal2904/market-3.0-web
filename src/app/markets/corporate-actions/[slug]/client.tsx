"use client";
import React, { useState, useEffect, useRef } from "react";
import CorporateActionseTabs from "@/components/CorporateActions/Tabs";
import { getFiiDiiData, getFiiDiiSummaryData } from "@/utils/utility";
import PageHeaderSection from "@/components/PageHeader";
import MarketTable from "@/components/MarketTable";
interface FiiDiiActivitySubPagesClientsProps {
  // summaryData: any;
  listData: any;
  summaryType: string;
  type: string;
}

const typeToFunctionMap: {
  [key: string]: (params: {
    filterType: string;
    apiType?: string;
  }) => Promise<any>;
} = {
  "cash-provisional": (params) =>
    getFiiDiiData("FIIDII_CASHPROVISIONAL", params),
  "fii-cash": (params) => getFiiDiiData("FIIDII_FIICASH", params),
  "fii-fno": (params) => getFiiDiiData("FIIDII_FANDOCASH", params),
  "mf-cash": (params) => getFiiDiiData("FIIDII_MFCASH", params),
};

const typeToSummaryParamMap: { [key: string]: string } = {
  cash: "cash",
  index: "foindex",
  stock: "fostock",
};

const CorporateActionsSubPageClients: React.FC<
  FiiDiiActivitySubPagesClientsProps
> = ({ summaryType, type, listData }) => {
  // , summaryData
  const [tableData, setTableData] = useState(listData);
  // const [summary, setSummary] = useState(summaryData);
  const [filterType, setFilterType] = useState<string>("daily");
  const [apiType, setApiType] = useState<string>(summaryType);
  const tableHeaderData = [
    { keyText: "Stock Name", keyId: "stockName" },
    { keyText: "Announced on", keyId: "announcedOn" },
    { keyText: "Type", keyId: "type" },
    { keyText: "Dividend %", keyId: "dividend" },
    { keyText: "Div./Share", keyId: "divShare" },
    { keyText: "Ex-Dividend", keyId: "exDividend" },
  ];

  const prevFilterType = useRef<string>(filterType);
  const prevApiType = useRef<string>(summaryType);

  useEffect(() => {
    if (
      prevFilterType.current !== filterType ||
      prevApiType.current !== apiType
    ) {
      fetchData(type);
    }
    if (prevApiType.current !== apiType) {
      fetchSummaryData();
    }
    prevFilterType.current = filterType;
    prevApiType.current = apiType;
  }, [filterType, apiType]);

  const fetchSummaryData = async () => {
    try {
      const summaryParam = typeToSummaryParamMap[apiType];
      const summaryResponse: any = await getFiiDiiSummaryData(summaryParam);
      // setSummary(summaryResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async (type: string) => {
    try {
      const responseGetter = typeToFunctionMap[type];
      if (responseGetter) {
        const response: any = await responseGetter({ filterType, apiType });
        const { listData } = response.datainfo.data;
        // setTableData(listData);
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
      <CorporateActionseTabs activeTab={type} handleApiType={onApiTypeChange} />
      {/* <MarketTable
        data={tableData}
        setFallbackWebsocket={false}
        tableHeaders={tableHeaderData}
      /> */}
    </>
  );
};

export default CorporateActionsSubPageClients;
