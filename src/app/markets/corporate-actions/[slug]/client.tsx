"use client";
import React, { useState, useEffect } from "react";

import TableComponent from "@/components/CorporateActions/TableComponent";
import CorporateActionseTabs from "@/components/CorporateActions/Tabs";
import { postRequest } from "@/utils/ajaxUtility";
import { getCookie } from "@/utils";

interface CorporateActionProps {
  selectedFilter: any;
  niftyData: any;
  flag: string;
}

const ENDPOINT_MAPPING = {
  dividend: {
    ep: "CORPORATE_ACTIONS_DIVIDEND",
    headers: [
      {
        keyText: "Stock Name",
        keyId: "companyName",
        watchlist: true,
        width: "400px",
      },
      {
        keyText: "Announced on",
        keyId: "announcementDateLong",
        sort: true,
        type: "date",
      },
      { keyText: "Type", keyId: "dividendType" },
      { keyText: "Dividend %", keyId: "percent" },
      { keyText: "Div./Share", keyId: "value" },
      { keyText: "Ex-Dividend", keyId: "xdDateLong", sort: true, type: "date" },
    ],
  },
  bonus: {
    ep: "CORPORATE_ACTIONS_BONUS",
    headers: [
      {
        keyText: "Stock Name",
        keyId: "companyName",
        watchlist: true,
        width: "400px",
      },
      {
        keyText: "Announced on",
        keyId: "dateOfAnnouncementLong",
        sort: true,
        type: "date",
      },
      { keyText: "Record", keyId: "recordDateLong", type: "date" },
      { keyText: "Ratio", keyId: "ratio" },
      { keyText: "Ex-Dividend", keyId: "xbDateLong", sort: true, type: "date" },
    ],
  },
  "board-meetings": {
    ep: "CORPORATE_ACTIONS_BOARDMEETINGS",
    headers: [
      { keyText: "Stock Name", keyId: "companyName", watchlist: true },
      { keyText: "Agenda", keyId: "purpose", sort: true },
      { keyText: "Meeting On", keyId: "meetingDateLong", type: "date" },
    ],
  },
  "agm-egm": {
    ep: "CORPORATE_ACTIONS_AGMEGM",
    headers: [
      { keyText: "Stock Name", keyId: "companyName", watchlist: true },
      { keyText: "Meeting On", keyId: "dateLong", sort: true, type: "date" },
      { keyText: "Purpose", keyId: "purpose" },
    ],
  },
  splits: {
    ep: "CORPORATE_ACTIONS_SPLITS",
    headers: [
      { keyText: "Stock Name", keyId: "companyName", watchlist: true },
      { keyText: "Old FV", keyId: "oldFaceValue" },
      { keyText: "New FV", keyId: "newFaceValue" },
      {
        keyText: "Ex-Split",
        keyId: "dateOfAnnouncementLong",
        sort: true,
        type: "date",
      },
    ],
  },
  rights: {
    ep: "CORPORATE_ACTIONS_RIGHTS",
    headers: [
      {
        keyText: "Stock Name",
        keyId: "companyName",
        watchlist: true,
        width: "400px",
      },
      { keyText: "Ratio", keyId: "ratio" },
      { keyText: "FV", keyId: "faceValueOfferedInstrument" },
      { keyText: "Premium", keyId: "rightsPremium" },
      {
        keyText: "Announced on",
        keyId: "dateOfAnnouncementLong",
        sort: true,
        type: "date",
      },
      { keyText: "Record", keyId: "recordDateLong", type: "date" },
      {
        keyText: "Ex-Rights",
        keyId: "recordDateLong",
        sort: true,
        type: "date",
      },
    ],
  },
};

const CorporateActionsClient: React.FC<CorporateActionProps> = ({
  selectedFilter,
  niftyData,
  flag,
}) => {
  const [filters, setFilters] = useState({
    duration: "default",
    filterValue: "",
  });
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const [processingLoader, setProcessingLoader] = useState(false);
  const [pagesummary, setPageSummary] = useState({});
  const [tableData, setTableData] = useState([]);
  const [currPage, setCurrPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, [filters, flag, currPage]);

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
