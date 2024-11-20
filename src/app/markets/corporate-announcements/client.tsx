"use client";
import React, { useState, useEffect } from "react";

import CorporateAnnouncementFilters from "@/components/CorporateAnnouncements/Filters";
import CardsList from "@/components/CorporateAnnouncements/Card";
import { postRequest } from "@/utils/ajaxUtility";
import Blocker from "@/components/Blocker";
import Loader from "@/components/Loader";

interface CorporateAnnouncementProps {
  selectedFilter: any;
  allFilters: any;
}

const CorporateAnnouncementsClient: React.FC<CorporateAnnouncementProps> = ({
  selectedFilter,
  allFilters,
}) => {
  const [filters, setFilters] = useState({
    filterValue: "",
    duration: "3month",
    category: [],
  });
  const [pagesummary, setPageSummary] = useState({
    totalRecords: 12,
    totalPages: 1,
    pageSize: 12,
    pageNo: 1,
  });
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const [processingLoader, setProcessingLoader] = useState(false);
  const [listData, setListData] = useState([]);
  const [currPage, setCurrPage] = useState(1);

  useEffect(() => {
    getAnnouncementsList();
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
    const announcementsList: any = await postRequest(
      "CORPORATE_ANNOUNCEMENTS",
      filtersData,
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
            type={"noDataFound"}
            customMessage={`No new corporate announcements found for the selected filters.<span class="desc">Try choosing a different filter to explore the latest announcements</span>`}
          />
        )}
      </div>
    </>
  );
};

export default CorporateAnnouncementsClient;
