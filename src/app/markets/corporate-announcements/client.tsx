"use client";
import React, { useState, useEffect } from "react";

import CorporateAnnouncementFilters from "@/components/CorporateAnnouncements/Filters";
import CardsList from "@/components/CorporateAnnouncements/Card";
import { postRequest } from "@/utils/ajaxUtility";
import Blocker from "@/components/Blocker";
import Loader from "@/components/Loader";
import { getCookie } from "@/utils";

interface CorporateAnnouncementProps {
  selectedFilter: any;
  allFilters: any;
  pageSummary: any;
  listingData: any;
}

const CorporateAnnouncementsClient: React.FC<CorporateAnnouncementProps> = ({
  selectedFilter,
  pageSummary,
  listingData,
  allFilters,
}) => {
  const [filters, setFilters] = useState({
    filterValue: "",
    duration: "3month",
    category: [],
  });
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const [processingLoader, setProcessingLoader] = useState(false);
  const [pagesummary, setPageSummary] = useState(pageSummary);
  const [listData, setListData] = useState(listingData);
  const [currPage, setCurrPage] = useState(1);

  useEffect(() => {
    const ssoid = getCookie("ssoid");
    if (filters?.filterValue === "watchlist" && !ssoid) {
      setListData([]);
    } else {
      getAnnouncementsList();
    }
  }, [filters, currPage]);

  const getAnnouncementsList = async () => {
    setProcessingLoader(true);
    const filtersData = {
      duration: filters?.duration,
      category: filters?.category,
      filterType: filters?.filterValue === "watchlist" ? "watchlist" : "index",
      filterValue: [0, "watchlist"].includes(filters?.filterValue)
        ? []
        : [filters?.filterValue],
      pagesize: "12",
      pageno: currPage,
    };
    const ssoid = getCookie("ssoid"),
      ticketId = getCookie("TicketId");

    const announcementsList: any = await postRequest(
      "CORPORATE_ANNOUNCEMENTS",
      filtersData,
      { ssoid: ssoid, ticketId: ticketId },
    );

    setListData(announcementsList?.searchresult);
    const pageSummery = {
      totalRecords: announcementsList?.pagesummary?.totalRecords,
      totalPages: announcementsList?.pagesummary?.totalpages,
      pageNo: currPage,
      pageSize: 12,
    };
    setPageSummary(pageSummery);
    setProcessingLoader(false);
  };

  const handlePageChange = (value: any) => {
    if (currPage !== value) {
      setCurrPage(value);
    }
  };

  return (
    <>
      <CorporateAnnouncementFilters
        setNiftyFilterData={setNiftyFilterData}
        selectedFilter={niftyFilterData}
        setFilters={setFilters}
        allFilters={allFilters}
      />
      <div className="prel">
        {processingLoader ? (
          <Loader loaderType="container" />
        ) : listData?.length ? (
          <CardsList
            listData={listData}
            pageSummary={pagesummary}
            onPageChange={handlePageChange}
          />
        ) : (
          <Blocker
            type={
              filters?.filterValue === "watchlist"
                ? "watchlitFilterBlocker"
                : "noDataFound"
            }
            customMessage={
              filters?.filterValue === "watchlist"
                ? ""
                : `No new corporate announcements found for the selected filters.<span class="desc">Try choosing a different filter to explore the latest announcements</span>`
            }
          />
        )}
      </div>
    </>
  );
};

export default CorporateAnnouncementsClient;
