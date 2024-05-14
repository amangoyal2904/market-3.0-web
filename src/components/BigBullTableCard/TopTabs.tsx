import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import StockFilterNifty from "../StockFilterNifty";
import { fetchFilters } from "@/utils/utility";

const TopTabs = ({
  niftyFilterData = {},
  filterDataChange,
  niftyFilter,
  searchInvestor,
  invstrQuery,
  invstrQueryHandler,
  title,
  spanTxt,
  sortByFilter = false,
  sortByTimeActive,
  sortByActive,
  sortByActiveHandler,
  pageType = "",
}: any) => {
  const showIndexFilter = niftyFilter;
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
        <h2
          className={styles.head3}
          dangerouslySetInnerHTML={{ __html: title }}
        />

        <div className={styles.rightFilterSec}>
          {pageType === "recentTransactions" ? (
            <>
              <div className={`${styles.sortFilter}`}>
                <span className={styles.stTxt}>Sort By: </span>
                <span className={styles.dyTxt}> {sortByTimeActive?.label}</span>
                <div className={styles.sortFilterContent}>
                  <div className={`moduleBody ${styles.body}`}>
                    <ul>
                      {sortByActive?.map((sort: any, index: number) => {
                        return (
                          <li
                            onClick={() => sortByActiveHandler(sort)}
                            className={`${sortByTimeActive.value === sort.value ? styles.active : ""}`}
                            key={`${index}-${sort.value}`}
                          >
                            {sort.label}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
          {sortByFilter ? (
            <div className={styles.sortyByFilter}>
              <div className={styles.sortSec}>
                <strong>Sort By: </strong> <span>All Positions</span>
              </div>
            </div>
          ) : (
            ""
          )}
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
          {searchInvestor ? (
            <div className={styles.searchInd}>
              <div className={styles.formGroup}>
                <span className={styles.searchIcon}></span>
                <input
                  type="text"
                  value={invstrQuery}
                  onChange={(e: any) => invstrQueryHandler(e.target.value)}
                  placeholder="Search Investor"
                />
              </div>
            </div>
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
