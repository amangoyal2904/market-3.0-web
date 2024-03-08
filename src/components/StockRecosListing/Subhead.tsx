"use client";

import styles from "./styles.module.scss";
import StockFilterNifty from "@/components/StockFilterNifty";
import { useEffect, useState } from "react";
import { fetchFilters } from "@/utils/utility";

const Subhead = (props: any) => {
  const { showIndexFilter, niftyFilterData = {}, filterDataChange } = props;
  const [showFilter, setShowFilter] = useState(false);
  const [filterMenuData, setFilterMenuData]: any = useState("");

  // ====  Here only Filter tabs code start here
  const showFilterMenu = (value: boolean) => {
    setShowFilter(value);
  };
  const handleChagneData = (id: any, name: string, selectedTab: string) => {
    setShowFilter(false);
    filterDataChange(id, name, selectedTab);
  };
  const filterApiCall = async () => {
    const data = await fetchFilters({ all: true });
    setFilterMenuData(data);
  };

  useEffect(() => {
    if (showIndexFilter) {
      filterApiCall();
    }
  }, []);
  // ====  Here only Filter tabs code end  here

  return (
    <>
      <div className={styles.subHead}>
        <div className={styles.headName}>Most Buys</div>
        <div className={styles.actionBarWrap}>
          <div className={styles.sortByWrap}>
            <span className={styles.sortByText}>Sort By:</span>
            <select className={styles.sortByDD}>
              <option>Performance High to Low</option>
              <option>Performance Low to High</option>
            </select>
          </div>
          <div
            onClick={() => showFilterMenu(true)}
            className={styles.niftyWrap}
          >
            <div className={styles.niftyBtn}>
              <span className="eticon_filter"></span>
              <span>{niftyFilterData?.name}</span>
            </div>
          </div>
          <div className={styles.listingTypeWrap}>
            <ul className={styles.listingType}>
              <li className={styles.active}>
                <span className="eticon_grid_view"></span>
              </li>
              <li>
                <span className="eticon_list_view"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {showFilter && (
        <StockFilterNifty
          data={filterMenuData}
          onclick={showFilterMenu}
          showFilter={showFilter}
          valuechange={handleChagneData}
          selectTab={niftyFilterData.selectedTab}
          childMenuTabActive={niftyFilterData.id}
        />
      )}
    </>
  );
};

export default Subhead;
