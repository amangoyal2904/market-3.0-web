"use client";
import React, { useState, useEffect } from "react";

import CorporateAnnouncementFilters from "@/components/CorporateAnnouncements/Filters";
import CardsList from "@/components/CorporateAnnouncements/Card";
import { postRequest } from "@/utils/ajaxUtility";
import { trackingEvent } from "@/utils/ga";

const CorporateAnnouncementsClient = () => {
  const [filters, setFilters] = useState({
    category: [],
    duration: "all",
  });
  const [listData, setListData] = useState([]);

  useEffect(() => {
    getAnnouncementsList();
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "click_filters",
      event_label: `${filters?.duration}, ${filters?.category}`,
    });
  }, [filters]);

  const getAnnouncementsList = async () => {
    const filtersData = {
      duration: filters?.duration,
      category: filters?.category,
      filterType: "index",
      filterValue: [],
      pagesize: "100",
    };
    const announcementsList: any = await postRequest(
      "CORPORATE_ANNOUNCEMENTS",
      filtersData,
    );
    setListData(announcementsList?.searchresult);
    console.log(announcementsList, "#announcementsList#");
  };

  return (
    <>
      <CorporateAnnouncementFilters setFilters={setFilters} filters={filters} />
      <CardsList listData={listData} />
    </>
  );
};

export default CorporateAnnouncementsClient;
