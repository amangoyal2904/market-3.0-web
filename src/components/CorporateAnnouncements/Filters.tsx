import { useCallback, useEffect, useState } from "react";

import styles from "./styles.module.scss";
import CustomDropdown from "../CustomDropdown";
import { getRequest } from "@/utils/ajaxUtility";
import CategoriesComponent from "./CategoriesDialog";

const CorporateAnnouncementFilters = () => {
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const overviewOptions = [
    { label: "All Time", key: "alltime" },
    { label: "Today", key: "today" },
    { label: "Last 3 Days", key: "last3" },
    { label: "Last 7 Days", key: "last7" },
    { label: "Last 15 Days", key: "last15" },
    { label: "Last 30 Days", key: "last30" },
    { label: "Last 60 Days", key: "last60" },
  ];

  useEffect(() => {
    getCategoriesList();
  }, []);

  const getCategoriesList = useCallback(async () => {
    const categoriesList: any = await getRequest("CORPORATE_CATEGORIES", {});
    setCategories(categoriesList);
    // console.log(categoriesList, '#categoriesList#');
  }, []);

  const handleDurationFilterChange = (key: string, label: string) => {
    console.log(key, label);
  };

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  return (
    <>
      <CustomDropdown
        filterOptions={overviewOptions}
        onFilterChange={handleDurationFilterChange}
        filterKey="key"
        filterLabelKey="label"
      />
      <span onClick={toggleCategories}>Categories</span>
      {showCategories && <CategoriesComponent categories={categories} />}
    </>
  );
};

export default CorporateAnnouncementFilters;
