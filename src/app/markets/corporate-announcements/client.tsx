"use client";
import React, { useState, useEffect } from "react";

import CorporateAnnouncementFilters from "@/components/CorporateAnnouncements/Filters";
import CardsList from "@/components/CorporateAnnouncements/Card";
import ETPagination from "@/components/Pagination/Pagination";
import { postRequest } from "@/utils/ajaxUtility";
import { trackingEvent } from "@/utils/ga";

interface CorporateAnnouncementProps {
  selectedFilter: any;
  advanceDecline: any;
  allFilters: any;
  overview: any;
  periodic: any;
}

const CorporateAnnouncementsClient: React.FC<CorporateAnnouncementProps> = ({
  allFilters,
  selectedFilter,
  overview,
  advanceDecline,
  periodic,
}) => {
  const [filters, setFilters] = useState({
    filterType: "index",
    duration: "all",
    category: [],
  });
  const [pagesummary, setPageSummary] = useState({
    pageNo: 1,
    pageSize: 12,
    totalPages: 1,
    totalRecords: 12,
  });
  const [listData, setListData] = useState([]);
  const [currPage, setCurrPage] = useState(1);

  const [advanceDeclineData, setAdvanceDeclineData] =
    useState<any>(advanceDecline);
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const [overviewData, setOverviewData] = useState<any>(overview);
  const [periodicData, setPeriodicData] = useState<any>(periodic);

  useEffect(() => {
    getAnnouncementsList();
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "click_filters",
      event_label: `${filters?.duration}, ${filters?.category}`,
    });
  }, [filters, currPage]);

  const getAnnouncementsList = async () => {
    const filtersData = {
      duration: filters?.duration,
      category: filters?.category,
      filterType: filters?.filterType,
      filterValue: [],
      pagesize: "12",
      pageno: currPage,
    };
    const announcementsList: any = await postRequest(
      "CORPORATE_ANNOUNCEMENTS",
      filtersData,
    );

    setListData(announcementsList?.searchresult);
    const pageSummery = {
      pageNo: currPage,
      pageSize: 12,
      totalPages: announcementsList?.pagesummary?.totalpages,
      totalRecords: announcementsList?.pagesummary?.totalRecords,
    };
    setPageSummary(pageSummery);
  };

  const handlePageChange = (value: any) => {
    if (currPage !== value) {
      setCurrPage(value);
    }
  };

  return (
    <>
      <CorporateAnnouncementFilters
        setFilters={setFilters}
        filters={filters}
        setNiftyFilterData={setNiftyFilterData}
        advanceDecline={advanceDeclineData}
        selectedFilter={niftyFilterData}
        allFilters={allFilters}
        overview={overviewData}
        periodic={periodicData}
      />
      <CardsList listData={listData} />
      {pagesummary?.totalPages > 1 && (
        <ETPagination
          pageSummary={pagesummary}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default CorporateAnnouncementsClient;
