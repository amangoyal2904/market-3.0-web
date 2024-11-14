import { useCallback, useEffect, useMemo, useState } from "react";

import CategoriesComponent from "./CategoriesDialog";
import StockFilterNifty from "../StockFilterNifty";
import { getRequest } from "@/utils/ajaxUtility";
import CustomDropdown from "../Common/CustomDropdown";
import styles from "./styles.module.scss";

interface FilterComponentProps {
  setNiftyFilterData: any;
  selectedFilter: any;
  setFilters: any;
  allFilters: any;
}

const CorporateAnnouncementFilters: React.FC<FilterComponentProps> = ({
  setNiftyFilterData,
  selectedFilter,
  setFilters,
  allFilters,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [categories, setCategories] = useState([]);

  const allFilterData = useMemo(() => allFilters, [allFilters]);

  const overviewOptions = [
    { label: "All Time", key: "all" },
    { label: "Today", key: "day" },
    { label: "Last 3 Days", key: "3days" },
    { label: "Last 7 Days", key: "week" },
    { label: "Last 15 Days", key: "15days" },
    { label: "Last 30 Days", key: "month" },
    { label: "Last 60 Days", key: "2month" },
    { label: "Last 90 Days", key: "3month" },
  ];

  useEffect(() => {
    getCategoriesList();
  }, []);

  const getCategoriesList = useCallback(async () => {
    const categoriesList: any = await getRequest("CORPORATE_CATEGORIES", {});
    setCategories(categoriesList);
  }, []);

  const handleDurationFilterChange = (key: string) => {
    setFilters((prevState: any) => ({
      ...prevState,
      duration: key,
    }));
  };

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  const onApply = () => {
    setShowCategories(false);
    setFilters((prevState: any) => ({
      ...prevState,
      category: selectedCategories,
    }));
  };

  const showFilterMenu = useCallback((value: boolean) => {
    setShowFilter(value);
  }, []);

  const filterDataChangeHander = async (
    id: any,
    name: string,
    selectedTab: string,
  ) => {
    setFilters((prevState: any) => ({
      ...prevState,
      filterValue: id,
    }));
    setShowFilter(false);
    setNiftyFilterData({
      name: name,
      indexId: id,
      seoname: name,
      exchange: selectedTab,
    });
  };

  return (
    <div className={styles.filtersBox}>
      <div className={styles.marginlr10}>
        <span
          className={`${styles.roundBtn} ${styles.filterNseBse}`}
          onClick={() => showFilterMenu(true)}
        >
          <i className="eticon_filter"></i> {selectedFilter?.name}
        </span>
      </div>
      {showFilter && (
        <StockFilterNifty
          data={allFilterData}
          onclick={showFilterMenu}
          showFilter={showFilter}
          valuechange={filterDataChangeHander}
          selectTab={selectedFilter.exchange}
          childMenuTabActive={selectedFilter.indexId}
        />
      )}
      <CustomDropdown
        filterOptions={overviewOptions}
        onFilterChange={handleDurationFilterChange}
        filterKey="key"
        filterLabelKey="label"
        selectedFilter={overviewOptions[7]}
      />
      <div className={styles.categoryBtn} onClick={toggleCategories}>
        Categories
        <i className="eticon_caret_down"></i>
        {selectedCategories?.length > 0 && !showCategories && (
          <span className={styles.count}>{selectedCategories?.length}</span>
        )}
      </div>
      {showCategories && (
        <CategoriesComponent
          onApply={onApply}
          categories={categories}
          showCategories={showCategories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      )}
    </div>
  );
};

export default CorporateAnnouncementFilters;
