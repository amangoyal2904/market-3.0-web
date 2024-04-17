import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import StockFilterNifty from "../StockFilterNifty";
import { fetchFilters } from "@/utils/utility";

const TopTabs = ({ niftyFilterData = {}, filterDataChange }: any) => {
  const showIndexFilter = true;
  const [showFilter, setShowFilter] = useState(false);
  const [filterMenuData, setFilterMenuData]: any = useState("");
  const showFilterMenu = (value: boolean) => {
    setShowFilter(value);
  };
  const handleChangeData = (id: any, name: string, selectedTab: string) => {
    setShowFilter(false);
    filterDataChange(id, name, selectedTab);
  };
  const filterApiCall = async () => {
    const data = await fetchFilters({ all: true, marketcap: true });
    setFilterMenuData(data);
  };
  useEffect(() => {
    if (showIndexFilter) {
      filterApiCall();
    }
  }, []);
  return (
    <>
      <div className={styles.topTabs}>
        <h2 className={styles.head3}>Individual Investors Tabs Heading</h2>

        <div className={styles.rightFilterSec}>
          {showIndexFilter ? (
            <span
              className={`${styles.roundBtn} ${styles.filterNseBse}`}
              onClick={() => showFilterMenu(true)}
            >
              <i className={`eticon_filter ${styles.mr}`}></i>{" "}
              {niftyFilterData?.name}
            </span>
          ) : (
            ""
          )}
        </div>
      </div>
      {showFilter && (
        <StockFilterNifty
          data={filterMenuData}
          onclick={showFilterMenu}
          showFilter={showFilter}
          valuechange={handleChangeData}
          selectTab={niftyFilterData.exchange}
          childMenuTabActive={niftyFilterData.indexId}
        />
      )}
    </>
  );
};

export default TopTabs;
