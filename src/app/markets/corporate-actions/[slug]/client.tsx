"use client";
import React, { useState, useEffect } from "react";

import TableComponent from "@/components/CorporateActions/TableComponent";
import CorporateActionseTabs from "@/components/CorporateActions/Tabs";
import { ENDPOINT_MAPPING } from "./endpoint_mapping";
import { postRequest } from "@/utils/ajaxUtility";
import { getCookie } from "@/utils";

interface CorporateActionProps {
  selectedFilter: any;
  tableListing: any;
  pageSummery: any;
  niftyData: any;
  flag: string;
}

const CorporateActionsClient: React.FC<CorporateActionProps> = ({
  selectedFilter,
  tableListing,
  pageSummery,
  niftyData,
  flag,
}) => {
  const [filters, setFilters] = useState({
    duration: "default",
    filterValue: "",
  });
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const [processingLoader, setProcessingLoader] = useState(false);
  const [pagesummary, setPageSummary] = useState(pageSummery);
  const [tableData, setTableData] = useState(tableListing);
  const [currPage, setCurrPage] = useState(1);

  useEffect(() => {
    setCurrPage(1);
    fetchData();
  }, [filters, flag]);

  useEffect(() => {
    fetchData();
  }, [currPage]);

  const fetchData = async () => {
    try {
      setProcessingLoader(true);
      const reqFilters = {
        filterValue: [0, "watchlist"].includes(filters?.filterValue)
          ? []
          : filters?.filterValue
            ? [filters?.filterValue]
            : [],
        filterType:
          filters?.filterValue === "watchlist"
            ? "watchlist"
            : filters?.filterValue
              ? "index"
              : "",
        duration: filters?.duration,
        pageNo: currPage,
        marketcap: "All",
        pageSize: 15,
      };

      const ssoid = getCookie("ssoid"),
        ticketId = getCookie("TicketId");

      const responseGetter = await postRequest(
        (ENDPOINT_MAPPING as any)[flag]?.ep,
        reqFilters,
        { ssoid: ssoid, ticketId: ticketId },
      );

      if (["rights", "bonus"].includes(flag)) {
        let data = responseGetter?.searchresult;
        data.forEach((ele: any) => {
          ele.ratio = `${ele?.ratioOffering || ele?.ratioOfferred}:${ele?.ratioExisting}`;
        });
        setTableData(data);
      } else {
        setTableData(responseGetter?.searchresult);
      }
      const pageSummery = {
        pageNo: currPage,
        pageSize: 15,
        totalPages: responseGetter?.pagesummary?.totalpages,
        totalRecords: responseGetter?.pagesummary?.totalRecords,
      };
      setPageSummary(pageSummery);
      setProcessingLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePageChangeHandler = (value: any) => {
    if (currPage !== value) {
      setCurrPage(value);
    }
  };

  return (
    <>
      <div className="prel">
        <CorporateActionseTabs
          setNiftyFilterData={setNiftyFilterData}
          selectedFilter={niftyFilterData}
          setFilters={setFilters}
          niftyData={niftyData}
          activeTab={flag}
        />
        <TableComponent
          header={(ENDPOINT_MAPPING as any)[flag]?.headers}
          handlePageChange={handlePageChangeHandler}
          processingLoader={processingLoader}
          pagesummary={pagesummary}
          tableData={tableData}
        />
      </div>
    </>
  );
};

export default CorporateActionsClient;
