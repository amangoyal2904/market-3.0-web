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

  // console.log("activeApi--", activeApi);

  // const filterDataChangeHander = async (id: any) => {
  //   //setProcessingLoader(true);
  //   const url = `${pathname}?${searchParams}`;
  //   const newUrl = updateOrAddParamToPath(url, "filter", id);
  //   const selectedFilter = await fetchSelectedFilter(id);
  //   setNiftyFilterData(selectedFilter);
  //   console.log("selectedFilter", selectedFilter);
  //   // setPayload({ ..._payload, filterValue: [id] });
  //   // updateL3NAV(id, _payload.duration);
  //   router.push(newUrl, { scroll: false });
  // };

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
    dispatch({
      type: "UPDATE_VIEWTYPE",
      payload: {
        viewType: type,
      },
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
              className={`${styles.mainTab} ${item.seoPath == activeTab || (item.seoPath == "fundhousedetails" && activeTab == "fundhousedetails") ? styles.active : ""}`}
            >
              {item.label == "News" ? (
                <Link href={item.redirectLink} target="_blank">
                  {item.label}
                </Link>
              ) : item.seoPath == "fundhousedetails" ? (
                <Link
                  href={`${(GLOBAL_CONFIG as any)["STOCK_RECOS"]["fundhousedetails"]}${urlFilterHandle()}`}
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  href={`${(GLOBAL_CONFIG as any)["STOCK_RECOS"]["home"]}/${handleLowerCase(item.seoPath)}${handleLowerCase(item.seoPath) == "newrecos" ? "/all" : ""}${urlFilterHandle()}`}
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
              <div className={styles.niftyBtn}>
                <span className={`eticon_filter ${styles.filterIcon}`}></span>
                <span>{niftyFilterData?.name}</span>
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
