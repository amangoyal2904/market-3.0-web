"use client";

import { useStateContext } from "../../store/StateContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { getStockRecosDetail } from "@/utils";
import {
  fetchFilters,
  fetchSelectedFilter,
  updateOrAddParamToPath,
} from "@/utils/utility";
import Grid from "./Grid";
import Listing from "./Listing";
import styles from "./styles.module.scss";
import Overview from "./Overviews";
import Subhead from "./Subhead";
import InnerLeftNav from "./InnerLeftNav";
import Blocker from "../Blocker";
import Loader from "../Loader";
import { trackingEvent } from "@/utils/ga";

const StockRecosListing = (props: any) => {
  const {
    recosDetailResult,
    selectedFilter,
    recosNavResult,
    activeApi,
    navListData,
    slug,
    overViewFilterRes,
  } = props;
  const { state, dispatch } = useStateContext();
  const { isLogin, ssoid } = state.login;
  const { watchlist } = state.watchlistStatus;
  const { viewType } = state.StockRecosStatus;

  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const [recoWatchListLoad, setRecoWatchListLoad] = useState(false);
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [recosDetailJSON, setRecosDetailJSON] = useState(
    activeApi == "overview"
      ? recosDetailResult
      : recosDetailResult?.recoData?.[0].data,
  );
  const [currentPageData, setCurrentPageData] = useState([]); // State to hold data for the current page
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(
    activeApi !== "overview" &&
      recosDetailResult?.recoData?.[0].data?.length === 30,
  );
  const loader = useRef(null);
  const initialSearchParamsRef = useRef<URLSearchParams>(
    new URLSearchParams(searchParams?.toString()),
  );

  const filterDataChangeHandler = useCallback(
    async (id: any) => {
      try {
        const url = `${pathName}?${searchParams}`;
        const newUrl = updateOrAddParamToPath(url, "filter", id);
        const selectedFilter = await fetchSelectedFilter(id);
        setNiftyFilterData(selectedFilter);
        router.push(newUrl, { scroll: false });
        initialSearchParamsRef.current = new URLSearchParams("filter=" + id);
        setPage(1);
        //setHasMore(true);
      } catch (Err) {
        console.log("filterDataChangeHandler Err:", Err);
      }
    },
    [pathName, searchParams, router],
  );

  const urlFilterHandle = useCallback(
    (filterIndex: any) => {
      return filterIndex
        ? `?filter=${filterIndex}`
        : niftyFilterData?.indexId
          ? `?filter=${niftyFilterData.indexId}`
          : "";
    },
    [niftyFilterData],
  );

  const fetchDataOnLazyLoad = useCallback(
    async (currentPage: any) => {
      if (activeApi !== "overview" && page > 1) {
        setTimeout(async () => {
          try {
            const newData: any = await getStockRecosDetail({
              getApiType: activeApi,
              slug,
              ssoid: isLogin ? ssoid : "",
              niftyFilterData,
              pageNo: currentPage,
            });

            if (newData?.recoData?.[0].data) {
              setRecosDetailJSON((prevData: any) => [
                ...prevData,
                ...newData.recoData[0].data,
              ]);
              setHasMore(
                typeof newData?.recoData?.[0].data !== "undefined" &&
                  newData?.recoData?.[0].data?.length === 30,
              );
            } else {
              setHasMore(false);
            }

            trackingEvent("event", {
              event_category: "mercury_engagement",
              event_action: "load_more_click",
              event_label: activeApi,
            });
          } catch (Err) {
            console.log("fetchDataOnLazyLoad Err: ", Err);
          }
        }, 1000);
      }
    },
    [activeApi, slug, page, isLogin, niftyFilterData],
  );

  useEffect(() => {
    fetchDataOnLazyLoad(page);
  }, [fetchDataOnLazyLoad, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    });

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [recosDetailJSON]);

  useEffect(() => {
    async function recosWatchList() {
      if (
        (pathName.indexOf("recos-on-your-watchlist") != -1 ||
          activeApi == "overview") &&
        isLogin
      ) {
        const recosDetailResult = await getStockRecosDetail({
          getApiType: activeApi,
          slug,
          ssoid: isLogin ? ssoid : "",
          niftyFilterData,
          pageNo: page,
        });

        // console.log(recosDetailResult);

        setRecosDetailJSON(
          activeApi == "overview"
            ? recosDetailResult
            : recosDetailResult?.recoData?.[0].data,
        );

        if (!recoWatchListLoad) setRecoWatchListLoad(true);

        setHasMore(
          typeof recosDetailResult?.recoData?.[0].data !== "undefined" &&
            recosDetailResult?.recoData?.[0].data?.length === 30,
        );
      }
    }

    recosWatchList();
  }, [isLogin, watchlist]);

  useEffect(() => {
    async function recosDetail() {
      const recosDetailResult = await getStockRecosDetail({
        getApiType: activeApi,
        slug,
        ssoid: isLogin ? ssoid : "",
        niftyFilterData,
        pageNo: page,
      });

      setRecosDetailJSON(
        activeApi == "overview"
          ? recosDetailResult
          : recosDetailResult?.recoData?.[0].data,
      );
      setHasMore(
        typeof recosDetailResult?.recoData?.[0].data !== "undefined" &&
          recosDetailResult?.recoData?.[0].data?.length === 30,
      );
    }

    if (
      !initialSearchParamsRef.current ||
      initialSearchParamsRef.current?.toString() !== searchParams?.toString()
    ) {
      window.scrollTo(0, 0); // Scroll to top
      recosDetail();
    }
  }, [searchParams, initialSearchParamsRef.current]);

  const handleObserver = useCallback(
    (entries: any) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && activeApi != "overview") {
        setPage((prevPage) => prevPage + 1);
      }
    },
    [hasMore],
  );

  return (
    <>
      <Subhead
        showIndexFilter={true}
        selectedFilter={selectedFilter}
        recosNavResult={recosNavResult}
        activeTab={slug?.[0]}
        slug={slug}
        niftyFilterData={niftyFilterData}
        filterDataChangeHander={filterDataChangeHandler}
        urlFilterHandle={urlFilterHandle}
        activeApi={activeApi}
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
            <span className={styles.addVal}>
              {recosDetailResult.recoData?.[0].topSection.addCount}
            </span>
          </div>
          <div className={styles.accumulateWrap}>
            <span className={styles.accumulateTitle}>Accumulate</span>
            <span className={styles.accumulateVal}>
              {recosDetailResult.recoData?.[0].topSection.accumulateCount}
            </span>
          </div>
          <div className={styles.neutralWrap}>
            <span className={styles.neutralTitle}>Neutral</span>
            <span className={styles.neutralVal}>
              {recosDetailResult.recoData?.[0].topSection.neutralCount}
            </span>
          </div>
        </div>
      )}
      <div
        className={`${styles.contentWrap} ${activeApi == "overview" ? styles.overviewWrap : ""}`}
      >
        {(activeApi == "newRecos" ||
          activeApi == "FHDetail" ||
          activeApi == "recoByFH") && (
          <InnerLeftNav
            recosNavResult={recosNavResult}
            recosDetailResult={navListData}
            activeApi={activeApi}
            slug={slug}
            niftyFilterData={niftyFilterData}
            urlFilterHandle={urlFilterHandle}
          />
        )}
        {activeApi == "overview" ? (
          <Overview
            data={recosDetailJSON}
            urlFilterHandle={urlFilterHandle}
            activeApi={activeApi}
            overViewFilterRes={overViewFilterRes}
          />
        ) : typeof recosDetailJSON != "undefined" &&
          recosDetailJSON.length > 0 ? (
          <div
            className={`${styles.contentViewWrap} ${activeApi == "newRecos" || activeApi == "FHDetail" || activeApi == "recoByFH" ? styles.gridViewWrap : ""}`}
          >
            {viewType == "grid" ? (
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
            {typeof recosDetailJSON != "undefined" &&
              activeApi != "overview" &&
              hasMore && (
                <div
                  ref={loader}
                  style={{ margin: "20px auto", textAlign: "center" }}
                >
                  <div className={styles.loaderFacebook}>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              )}
          </div>
        ) : (
          <div className={`${styles.listingWrap} ${styles.noDataFound}`}>
            {activeApi == "recoOnWatchlist" ? (
              !isLogin ? (
                <Blocker type="watchlitFilterBlocker" />
              ) : recoWatchListLoad ? (
                <Blocker type={"noDataFound"} />
              ) : (
                <Loader loaderType="inner" />
              )
            ) : (
              <Blocker type={"noDataFound"} />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default StockRecosListing;
