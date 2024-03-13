"use client";
import Grid from "./Grid";
import Listing from "./Listing";
import styles from "./styles.module.scss";
import Overview from "./Overviews";
import { useStateContext } from "../../store/StateContext";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { getStockRecosDetail } from "@/utils";
import Subhead from "./Subhead";
import {
  fetchFilters,
  getSelectedFilter,
  updateOrAddParamToPath,
} from "@/utils/utility";
import InnerLeftNav from "./InnerLeftNav";

const StockRecosListing = (props: any) => {
  const { state, dispatch } = useStateContext();
  const { isLogin, ssoid } = state.login;
  const { viewType } = state.StockRecosStatus;
  const {
    recosDetailResult,
    selectedFilter,
    recosNavResult,
    activeApi,
    navListData,
    slug,
  } = props;
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [recosDetailJSON, setRecosDetailJSON] = useState(recosDetailResult);

  const filterDataChangeHander = async (id: any) => {
    //setProcessingLoader(true);
    const url = `${pathName}?${searchParams}`;
    console.log("url---", url);
    const newUrl = updateOrAddParamToPath(url, "filter", id);
    const selectedFilter = await getSelectedFilter(id);
    setNiftyFilterData(selectedFilter);
    console.log("selectedFilter", selectedFilter);
    // setPayload({ ..._payload, filterValue: [id] });
    // updateL3NAV(id, _payload.duration);
    router.push(newUrl, { scroll: false });
  };

  const urlFilterHandle = () => {
    return niftyFilterData?.id ? "?filter=" + niftyFilterData?.id : "";
  };

  useEffect(() => {
    async function recosWatchList() {
      if (pathName.indexOf("recos-on-your-watchlist") != -1) {
        console.log(activeApi + "===" + slug);
        const recosDetailResult = await getStockRecosDetail({
          getApiType: activeApi,
          slug,
          ssoid: isLogin ? "ce1tl8rz8t1lk96gdlrxwquku" : "",
          niftyFilterData,
        });

        console.log(recosDetailResult);

        setRecosDetailJSON(recosDetailResult);
      }
    }

    recosWatchList();
    console.log("path changed", pathName);
  }, [pathName]);

  useEffect(() => {
    async function recosDetail() {
      const recosDetailResult = await getStockRecosDetail({
        getApiType: activeApi,
        slug,
        ssoid: isLogin ? "ce1tl8rz8t1lk96gdlrxwquku" : "",
        niftyFilterData,
      });

      setRecosDetailJSON(recosDetailResult);
    }
    if (searchParams.has("filter")) {
      recosDetail();
      console.log("searchParams changed", searchParams);
    }
  }, [searchParams]);

  return (
    <>
      <Subhead
        showIndexFilter={true}
        selectedFilter={selectedFilter}
        recosNavResult={recosNavResult}
        activeTab={slug?.[0]}
        slug={slug}
        niftyFilterData={niftyFilterData}
        filterDataChangeHander={filterDataChangeHander}
      />
      {activeApi == "FHDetail" && (
        <div className={styles.brokerageWrap}>
          <div className={styles.totalRecosWrap}>
            <span className={styles.totalRecosTitle}>Total Recos</span>
            <span className={styles.totalRecosval}>
              {recosDetailResult.recoData?.[0].topSection.totalCount}
            </span>
          </div>
          <div className={styles.pipe}></div>
          <div className={styles.buyWrap}>
            <span className={styles.buyTitle}>Buy</span>
            <span className={styles.buyval}>
              {recosDetailResult.recoData?.[0].topSection.buyCount}
            </span>
          </div>
          <div className={styles.sellWrap}>
            <span className={styles.sellTitle}>Sell</span>
            <span className={styles.sellVal}>
              {recosDetailResult.recoData?.[0].topSection.sellCount}
            </span>
          </div>
          <div className={styles.holdWrap}>
            <span className={styles.holdTitle}>Hold</span>
            <span className={styles.holdVal}>
              {recosDetailResult.recoData?.[0].topSection.holdCount}
            </span>
          </div>
          <div className={styles.addWrap}>
            <span className={styles.addTitle}>Add</span>
            <span className={styles.addVal}>-</span>
          </div>
          <div className={styles.accumulateWrap}>
            <span className={styles.accumulateTitle}>Accumulate</span>
            <span className={styles.accumulateVal}>-</span>
          </div>
          <div className={styles.neutralWrap}>
            <span className={styles.neutralTitle}>Neutral</span>
            <span className={styles.neutralVal}>-</span>
          </div>
        </div>
      )}
      <div
        className={`${styles.contentWrap} ${slug?.[0] == "overview" ? styles.overviewWrap : ""}`}
      >
        {(activeApi == "newRecos" || slug.includes("fundhousedetails")) && (
          <InnerLeftNav
            recosNavResult={recosNavResult}
            recosDetailResult={navListData}
            activeApi={activeApi}
            slug={slug}
            niftyFilterData={niftyFilterData}
          />
        )}
        {slug?.[0] == "overview" ? (
          <Overview data={recosDetailJSON} urlFilterHandle={urlFilterHandle} />
        ) : viewType == "grid" ? (
          <Grid
            recosDetailResult={recosDetailJSON}
            activeApi={activeApi}
            urlFilterHandle={urlFilterHandle}
          />
        ) : (
          <Listing
            recosDetailResult={recosDetailJSON}
            activeApi={activeApi}
            urlFilterHandle={urlFilterHandle}
          />
        )}
      </div>
    </>
  );
};

export default StockRecosListing;
