"use client";
import React, { useState, useEffect, useRef } from "react";

import TableComponent from "@/components/CorporateActions/TableComponent";
import CorporateActionseTabs from "@/components/CorporateActions/Tabs";
import { postRequest } from "@/utils/ajaxUtility";
interface CorporateActionProps {
  flag: string;
}

const ENDPOINT_MAPPING = {
  dividend: {
    ep: "CORPORATE_ACTIONS_DIVIDEND",
    headers: [
      { keyText: "Stock Name", keyId: "companyName", watchlist: true },
      {
        keyText: "Announced on",
        keyId: "announcementDateLong",
        sort: true,
        type: "date",
      },
      { keyText: "Type", keyId: "dividendType" },
      { keyText: "Dividend %", keyId: "value" },
      { keyText: "Div./Share", keyId: "current" },
      { keyText: "Ex-Dividend", keyId: "xdDateLong", sort: true, type: "date" },
    ],
  },
  bonus: {
    ep: "CORPORATE_ACTIONS_BONUS",
    headers: [
      { keyText: "Stock Name", keyId: "companyName", watchlist: true },
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
      { keyText: "Stock Name", keyId: "companyName", watchlist: true },
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

const CorporateActionsClient: React.FC<CorporateActionProps> = ({ flag }) => {
  const [filterType, setFilterType] = useState<string>("default");
  const [currPage, setCurrPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [pagesummary, setPageSummary] = useState({});

  useEffect(() => {
    fetchData();
  }, [filterType, flag, currPage]);

  const fetchData = async () => {
    try {
      const filters = {
        pageNo: currPage,
        marketcap: "All",
        filterValue: ["2371"],
        pageSize: 10,
        duration: filterType,
        filterType: "index",
      };
      if (flag === "dividend") {
        filters["filterValue"] = ["14034"];
        filters["filterType"] = "company";
      }

      const responseGetter = await postRequest(
        (ENDPOINT_MAPPING as any)[flag]?.ep,
        filters,
      );

      if (["rights", "bonus"].includes(flag)) {
        let data = responseGetter?.searchresult;
        data.forEach((ele: any) => {
          ele.ratio = `${ele?.ratioExisting}:${ele?.ratioOffering || ele?.ratioOfferred}`;
        });
        setTableData(data);
      } else {
        setTableData(responseGetter?.searchresult);
      }
      const pageSummery = {
        pageNo: currPage,
        pageSize: 10,
        totalPages: responseGetter?.pagesummary?.totalpages,
        totalRecords: responseGetter?.pagesummary?.totalRecords,
      };
      setPageSummary(pageSummery);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onFilterChange = (filterType: string) => {
    setFilterType(filterType);
  };

  const handlePageChangeHandler = (value: any) => {
    if (currPage !== value) {
      setCurrPage(value);
    }
  };

  return (
    <>
      <CorporateActionseTabs activeTab={flag} />
      <TableComponent
        pagesummary={pagesummary}
        handlePageChange={handlePageChangeHandler}
        header={(ENDPOINT_MAPPING as any)[flag]?.headers}
        tableData={tableData}
      />
    </>
  );
};

export default CorporateActionsClient;
