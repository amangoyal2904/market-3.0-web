import { useState } from "react";

import styles from "./styles.module.scss";
import CustomDropdown from "../CustomDropdown";

const CorporateAnnouncementFilters = () => {
  const overviewOptions = [
    { label: "All Time", key: "alltime" },
    { label: "Today", key: "today" },
    { label: "Last 3 Days", key: "last3" },
    { label: "Last 7 Days", key: "last7" },
    { label: "Last 15 Days", key: "last15" },
    { label: "Last 30 Days", key: "last30" },
    { label: "Last 60 Days", key: "last60" },
  ];
  const handleDurationFilterChange = (key: string, label: string) => {
    console.log(key, label);
  };

  return (
    <CustomDropdown
      filterOptions={overviewOptions}
      onFilterChange={handleDurationFilterChange}
      filterKey="key"
      filterLabelKey="label"
    />
  );
};

export default CorporateAnnouncementFilters;
