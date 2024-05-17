"use client";

import styles from "./styles.module.scss";
import StockFilterNifty from "@/components/StockFilterNifty";
import { useEffect, useState } from "react";
import {
  fetchFilters,
  fetchSelectedFilter,
  updateOrAddParamToPath,
} from "@/utils/utility";
import Link from "next/link";
import { useStateContext } from "../../store/StateContext";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import GLOBAL_CONFIG from "../../network/global_config.json";
import { trackingEvent } from "@/utils/ga";

const Subhead = (props: any) => {
  const {
    showIndexFilter,
    selectedFilter,
    recosNavResult,
    activeTab,
    slug,
    filterDataChangeHander,
    niftyFilterData,
    urlFilterHandle,
    activeApi,
  } = props;
  const [showFilter, setShowFilter] = useState(false);
  const [filterMenuData, setFilterMenuData]: any = useState("");
  //const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const { state, dispatch } = useStateContext();
  const { viewType } = state.StockRecosStatus;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // ====  Here only Filter tabs code start here
  const showFilterMenu = (value: boolean) => {
    setShowFilter(value);
  };
  const handleChangeData = (id: any, name: string, selectedTab: string) => {
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

  const handleViewType = (type: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "page_cta_click",
      event_label: type == "card" ? "grid" : "list",
    });

    dispatch({
      type: "UPDATE_VIEWTYPE",
      payload: {
        viewType: type,
      },
    });
  };

  const handleTabTracking = (tabName: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "tab_selected",
      event_label: tabName,
    });
  };

  // ====  Here only Filter tabs code end  here

  return (
    <>
      <div className={styles.subHead}>
        {/* <div className={styles.headName}>Most Buys</div> */}
        <ul className={styles.mainTabsList}>
          {recosNavResult?.tabs.map((item: any, index: any) => (
            <li
              key={`recos_main_${index}`}
              className={`${styles.mainTab} ${item.seoPath == activeTab || (item.seoPath == "fundhousedetails" && (activeApi == "recoByFH" || activeApi == "FHDetail")) ? styles.active : ""}`}
            >
              {item.label == "News" ? (
                <Link
                  href={item.redirectLink}
                  target="_blank"
                  onClick={() => handleTabTracking(item.label)}
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  data-tt={item.seoPath}
                  href={`${(GLOBAL_CONFIG as any)["STOCK_RECOS"][item.seoPath]}${urlFilterHandle()}`}
                  onClick={() => handleTabTracking(item.label)}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className={styles.actionBarWrap}>
          {activeApi != "recoOnWatchlist" && activeApi != "recoByFH" && (
            <div
              onClick={() => showFilterMenu(true)}
              className={styles.niftyWrap}
            >
              <div className={styles.niftyBtn} title={niftyFilterData?.name}>
                <span className={`eticon_filter ${styles.filterIcon}`}></span>
                <span className={`${styles.filerName}`}>
                  {niftyFilterData?.name}
                </span>
              </div>
            </div>
          )}
          {slug?.[0] != "overview" && (
            <div className={styles.listingTypeWrap}>
              <ul className={styles.listingType}>
                <li
                  key="listytpe_grid"
                  className={viewType === "card" ? styles.active : ""}
                  onClick={() => handleViewType("card")}
                >
                  <span
                    className={`eticon_grid_view ${styles.listingIcon}`}
                  ></span>
                </li>
                <li
                  key="listytpe_view"
                  className={viewType === "grid" ? styles.active : ""}
                  onClick={() => handleViewType("grid")}
                >
                  <span
                    className={`eticon_list_view ${styles.listingIcon}`}
                  ></span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {showFilter && (
        <StockFilterNifty
          data={filterMenuData}
          onclick={showFilterMenu}
          showFilter={showFilter}
          valuechange={handleChangeData}
          selectTab={niftyFilterData.exchange || "nse"}
          childMenuTabActive={niftyFilterData.indexId}
        />
      )}
    </>
  );
};

export default Subhead;
