"use client";
import Grid from "./Grid";
import Listing from "./Listing";
import styles from "./styles.module.scss";
import Overview from "./Overviews";
import { useStateContext } from "../../store/StateContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { getStockRecosDetail } from "@/utils";
import Subhead from "./Subhead";
import {
  fetchFilters,
  fetchSelectedFilter,
  updateOrAddParamToPath,
} from "@/utils/utility";
import InnerLeftNav from "./InnerLeftNav";
import Blocker from "../Blocker";

const StockRecosListing = (props: any) => {
  const {
    recosDetailResult,
    selectedFilter,
    recosNavResult,
    activeApi,
    navListData,
    slug,
  } = props;
  const { state, dispatch } = useStateContext();
  const { isLogin, ssoid } = state.login;
  const { viewType } = state.StockRecosStatus;
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
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
    activeApi != "overview" &&
      recosDetailResult?.recoData?.[0].data?.length === 30
      ? true
      : false,
  );
  const loader = useRef(null);
  const initialSearchParamsRef = useRef<URLSearchParams>(
    new URLSearchParams(searchParams.toString()),
  );

  const filterDataChangeHandler = useCallback(
    async (id: any) => {
      const url = `${pathName}?${searchParams}`;
      const newUrl = updateOrAddParamToPath(url, "filter", id);
      const selectedFilter = await fetchSelectedFilter(id);
      setNiftyFilterData(selectedFilter);
      router.push(newUrl, { scroll: false });
      initialSearchParamsRef.current = new URLSearchParams("filter=" + id);

      setPage(1);
      setHasMore(true);
    },
    [pathName, searchParams, router],
  );

  const urlFilterHandle = useCallback(() => {
    return niftyFilterData?.indexId ? `?filter=${niftyFilterData.indexId}` : "";
  }, [niftyFilterData]);

  const fetchDataOnLazyLoad = useCallback(
    async (currentPage: any) => {
      if (activeApi !== "overview" && page > 1) {
        setTimeout(async () => {
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
  }, []);

  useEffect(() => {
    async function recosWatchList() {
      if (pathName.indexOf("recos-on-your-watchlist") != -1) {
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
      }
    }

    recosWatchList();
    // console.log("path changed", pathName);
  }, []);

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
    }

    if (
      !initialSearchParamsRef.current ||
      initialSearchParamsRef.current.toString() !== searchParams.toString()
    ) {
      //if (searchParams.has("filter")) {
      recosDetail();
      // console.log("searchParams changed", searchParams);
      //}
    }
  }, [searchParams, initialSearchParamsRef.current]);

  const handleObserver = useCallback(
    (entries: any) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && activeApi != "overview") {
        setPage((prevPage) => prevPage + 1);
      }

      // console.log("recosDetailJSON---handleObserver-", recosDetailResult);
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
        className={`${styles.contentWrap} ${slug?.[0] == "overview" ? styles.overviewWrap : ""}`}
      >
        {(activeApi == "newRecos" || slug.includes("fundhousedetails")) && (
          <InnerLeftNav
            recosNavResult={recosNavResult}
            recosDetailResult={navListData}
            activeApi={activeApi}
            slug={slug}
            niftyFilterData={niftyFilterData}
            urlFilterHandle={urlFilterHandle}
          />
        )}
        {slug?.[0] == "overview" ? (
          <Overview
            data={recosDetailJSON}
            urlFilterHandle={urlFilterHandle}
            activeApi={activeApi}
          />
        ) : typeof recosDetailJSON != "undefined" ? (
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
                <Blocker type="loginBlocker" />
              ) : (
                <Blocker type={"noDataFound"} />
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
