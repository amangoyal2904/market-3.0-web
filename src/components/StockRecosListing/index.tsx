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
  getSelectedFilter,
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
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  const filterDataChangeHander = async (id: any) => {
    const url = `${pathName}?${searchParams}`;
    const newUrl = updateOrAddParamToPath(url, "filter", id);
    const selectedFilter = await getSelectedFilter(id);
    setNiftyFilterData(selectedFilter);
    router.push(newUrl, { scroll: false });
  };

  const urlFilterHandle = () => {
    return niftyFilterData?.id ? "?filter=" + niftyFilterData?.id : "";
  };

  const fetchDataOnLazyLoad = async (currentPage: any) => {
    // Simulated API call
    setTimeout(async () => {
      const newData: any = await getStockRecosDetail({
        getApiType: activeApi,
        slug,
        ssoid: isLogin ? "ce1tl8rz8t1lk96gdlrxwquku" : "",
        niftyFilterData,
        pageNo: currentPage,
      });
      //console.log("newData---", newData)
      typeof newData?.recoData?.[0].data != "undefined" &&
        setRecosDetailJSON((prevData: any) => [
          ...prevData,
          ...newData?.recoData?.[0].data,
        ]);
      setCurrentPageData(newData); // Set data for the current page
      setHasMore(
        typeof newData?.recoData?.[0].data != "undefined" &&
          newData?.recoData?.[0].data?.length == 30,
      ); // Simulating 3 pages of data

      console.log("fetchDataOnLazyLoad hit", currentPage, hasMore);
    }, 1000);
  };

  useEffect(() => {
    fetchDataOnLazyLoad(page);
  }, [page]);

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
    setPage(1);
    setHasMore(true);
    async function recosWatchList() {
      if (pathName.indexOf("recos-on-your-watchlist") != -1) {
        console.log(activeApi + "===" + slug);
        const recosDetailResult = await getStockRecosDetail({
          getApiType: activeApi,
          slug,
          ssoid: isLogin ? "ce1tl8rz8t1lk96gdlrxwquku" : "",
          niftyFilterData,
          pageNo: page,
        });

        console.log(recosDetailResult);

        setRecosDetailJSON(recosDetailResult?.recoData?.[0].data);
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
        pageNo: page,
      });

      setRecosDetailJSON(recosDetailResult?.recoData?.[0].data);
    }
    if (searchParams.has("filter")) {
      recosDetail();
      console.log("searchParams changed", searchParams);
    }
  }, [searchParams]);

  const handleObserver = useCallback(
    (entries: any) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }

      console.log("recosDetailJSON----", recosDetailJSON);
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
        ) : typeof recosDetailJSON != "undefined" ? (
          viewType == "grid" ? (
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
          )
        ) : (
          <div className={`${styles.listingWrap} ${styles.noDataFound}`}>
            {activeApi == "recoOnWatchlist" && !isLogin ? (
              <Blocker type="loginBlocker" />
            ) : (
              <Blocker type={"noDataFound"} />
            )}
          </div>
        )}
      </div>
      {typeof recosDetailJSON != "undefined" && hasMore && (
        <div ref={loader} style={{ margin: "20px auto", textAlign: "center" }}>
          Loading...
        </div>
      )}
    </>
  );
};

export default StockRecosListing;
