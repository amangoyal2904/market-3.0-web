"use client";

import styles from "./styles.module.scss";
import StockFilterNifty from "@/components/StockFilterNifty";
import { useEffect, useState } from "react";
import { fetchFilters, getSelectedFilter } from "@/utils/utility";
import Link from "next/link";

const Subhead = (props: any) => {
  const {
    showIndexFilter,
    selectedFilter,
    recosNavResult,
    activeTab,
    slug,
    activeItem,
    setActiveItem,
  } = props;
  const [showFilter, setShowFilter] = useState(false);
  const [filterMenuData, setFilterMenuData]: any = useState("");
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);

  const filterDataChangeHander = async (id: any) => {
    //setProcessingLoader(true);
    // const url = `${pathname}?${searchParams}`;
    // const newUrl = updateOrAddParamToPath(url, "filter", id);
    const selectedFilter = await getSelectedFilter(id);
    setNiftyFilterData(selectedFilter);
    console.log("selectedFilter", selectedFilter);
    // setPayload({ ..._payload, filterValue: [id] });
    // updateL3NAV(id, _payload.duration);
    // router.push(newUrl, { scroll: false });
  };

  // ====  Here only Filter tabs code start here
  const showFilterMenu = (value: boolean) => {
    setShowFilter(value);
  };
  const handleChagneData = (id: any, name: string, selectedTab: string) => {
    setShowFilter(false);
    filterDataChangeHander(id);
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

  const handleLowerCase = (item: any) => {
    return item.toLowerCase();
  };

  // ====  Here only Filter tabs code end  here

  //console.log("recosNavResult---", recosNavResult);

  return (
    <>
      <div className={styles.subHead}>
        {/* <div className={styles.headName}>Most Buys</div> */}
        <ul className={styles.mainTabsList}>
          {recosNavResult?.tabs.map((item: any, index: any) => (
            <li
              key={`recos_main_${index}`}
              className={`${styles.mainTab} ${item.seoPath == activeTab || (item.seoPath == "recobyfh" && activeTab == "fundhousedetails") ? styles.active : ""}`}
            >
              {item.seoPath == "recobyfh" ? (
                <Link href={`/stocksrecos/fundhousedetails`}>{item.label}</Link>
              ) : (
                <Link
                  href={`/stocksrecos/${handleLowerCase(item.seoPath)}${handleLowerCase(item.seoPath) == "newrecos" ? "/all" : ""}`}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        {slug?.[0] != "overview" && (
          <div className={styles.actionBarWrap}>
            {/* <div className={styles.sortByWrap}>
              <span className={styles.sortByText}>Sort By:</span>
              <select className={styles.sortByDD}>
                <option>Performance High to Low</option>
                <option>Performance Low to High</option>
              </select>
            </div> */}
            {slug?.[0] != "fundhousedetails" && (
              <div
                onClick={() => showFilterMenu(true)}
                className={styles.niftyWrap}
              >
                <div className={styles.niftyBtn}>
                  <span className="eticon_filter"></span>
                  <span>{niftyFilterData?.name}</span>
                </div>
              </div>
            )}
            <div className={styles.listingTypeWrap}>
              <ul className={styles.listingType}>
                <li
                  key="listytpe_grid"
                  className={
                    activeItem === "listytpe_card" ? styles.active : ""
                  }
                  onClick={() => setActiveItem("listytpe_card")}
                >
                  <span className="eticon_grid_view"></span>
                </li>
                <li
                  key="listytpe_view"
                  className={
                    activeItem === "listytpe_table" ? styles.active : ""
                  }
                  onClick={() => setActiveItem("listytpe_table")}
                >
                  <span className="eticon_list_view"></span>
                </li>
              </ul>
            </div>
          </div>
        )}
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
