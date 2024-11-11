import { useState, useEffect, useRef } from "react";
import styles from "./StockAdd.module.scss";
import APIS_CONFIG from "../../network/api_config.json";
import { APP_ENV } from "../../utils/index";
// import WatchlistAddition from "../WatchlistAddition";
import { useStateContext } from "../../store/StateContext";
import { fetchAllWatchListData } from "../../utils/utility";
import dynamic from "next/dynamic";
const WatchlistAddition = dynamic(() => import("../WatchlistAddition"), {
  ssr: false,
});

type Stock = {
  companyId: string;
  companyType: string;
};

const AddStockComponent = ({ moduelClose, updateTableHandler }: any) => {
  const { state, dispatch } = useStateContext();
  const { watchlist } = state.watchlistStatus;

  //console.log("watchlist___", watchlist);

  const [viewStocks, setViewStocks]: any = useState([]);
  const [mostStocks, setMostStocks]: any = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchNode, setSearchNode] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [watchlistStock, setWatchlistStock] = useState<Stock[]>([]);
  const viewWraperRef = useRef<HTMLDivElement>(null);
  const [showTextDefault, setShowTextDefault] = useState(false);
  const addStockModuleHandler = () => {
    moduelClose(false);
  };

  const handleInputChange = (e: any) => {
    setSearchNode(e.target.value);
    if (e.target.value === "") {
      setViewStocks([...mostStocks]);
    }
  };
  const FetchDataSearchView = () => {
    if (searchNode !== "") {
      const API_URL = (APIS_CONFIG as any)?.stockSearch[APP_ENV];
      fetch(`${API_URL}${searchNode}`)
        .then((response) => response.json())
        .then((res) => {
          const filterData =
            res.length > 0
              ? res.filter((stock: any) => stock.subType !== "NonList")
              : [];
          const addFollowFlag = filterData.map((stock: any) => {
            const followData = watchlistStock.find(
              (watchlist: any) =>
                watchlist.prefDataVal === stock.tagId &&
                ((watchlist.companyType === "equity" &&
                  stock.entityType === "company") ||
                  watchlist.companyType === stock.subType),
            );
            const data = followData
              ? { ...stock, follow: "yes" }
              : { ...stock, follow: "no" };
            return data;
          });

          setViewStocks(addFollowFlag);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const fetchWatchListStocks = async () => {
    setLoading(true);
    const data = await fetchAllWatchListData();
    if (data?.length > 0) {
      setWatchlistStock(data);
      fetchMostPopularStocks(data);
    } else {
      fetchMostPopularStocks();
    }
    setLoading(false);
  };
  const fetchMostPopularStocks = async (watchListUserData: any = []) => {
    setLoading(true);
    try {
      const API_URL = (APIS_CONFIG as any)?.SEARCH.mostPopular[APP_ENV];
      fetch(API_URL)
        .then((response) => response.json())
        .then((res) => {
          const mostData = res?.searchresult || [];
          const addFollowFlag =
            mostData.length > 0
              ? mostData.map((stock: any) => {
                  const followData = watchListUserData.find(
                    (watchlist: any) =>
                      watchlist.prefDataVal === stock.companyid &&
                      watchlist.companyType === stock.companytype,
                  );
                  const data = followData
                    ? {
                        ...stock,
                        follow: "yes",
                        tagId: stock.companyid,
                        tagName: stock.companyname,
                      }
                    : {
                        ...stock,
                        follow: "no",
                        tagId: stock.companyid,
                        tagName: stock.companyname,
                      };
                  return data;
                })
              : [];
          setMostStocks(addFollowFlag); // set for all most view stocks popular
          setViewStocks(addFollowFlag);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
      setTimeout(() => {
        setShowTextDefault(true);
      }, 1000);
    } catch (error) {
      console.log("most search api error ", error);
      setLoading(false);
    }
  };
  const wathlistFunctionHandler = () => {
    updateTableHandler();
  };
  const viewDataListSet = (data: any) => {
    return (
      <ul className={`customScroll ${styles.lsitItem}`}>
        {data.map((item: any, index: any) => {
          const commpanyName = item.companyname || item.tagName;
          const companyId = item.companyid || item.tagId;
          const companyType =
            item.companytype ||
            (item.subType === "company" ? "equity" : item.subType);
          return (
            <li key={`${item.tagId}--${index}`}>
              <span>{item.tagName}</span>
              <WatchlistAddition
                companyName={commpanyName}
                companyId={companyId}
                companyType={companyType}
                customStyle={{
                  width: "18px",
                  height: "18px",
                }}
                customeFun={wathlistFunctionHandler}
              />
            </li>
          );
        })}
      </ul>
    );
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearchTerm(searchNode);
    }, 500);

    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [searchNode]);
  useEffect(() => {
    if (debouncedSearchTerm !== "") {
      FetchDataSearchView();
    }
  }, [debouncedSearchTerm]);
  useEffect(() => {
    fetchWatchListStocks();
  }, []);
  // useEffect(() => {
  //   updateTableHandler();
  // }, [watchlist]);
  return (
    <>
      <div className={`customModule ${styles.addStockWrap}`}>
        <div
          className={styles.divOverlya}
          onClick={() => moduelClose(false)}
        ></div>
        <div className={`moduleWrap ${styles.stockSec}`} ref={viewWraperRef}>
          <div className={`moduleHeader ${styles.header}`}>
            <div className={styles.formGroup}>
              <span className={`eticon_search ${styles.searchIcon}`}></span>
              <input
                type="text"
                value={searchNode}
                onChange={(e) => handleInputChange(e)}
                placeholder="Search & Add Stocks"
                maxLength={100}
              />
            </div>
          </div>
          <div className={styles.bodySec}>
            {viewStocks.length > 0 ? (
              <h3 className={styles.comHead}>Companies</h3>
            ) : (
              ""
            )}

            {viewStocks.length > 0 ? (
              viewDataListSet(viewStocks)
            ) : (
              <div className={styles.noData}>
                {showTextDefault &&
                  `Company not found! Please refine your search`}
              </div>
            )}
          </div>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.loader}></div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
export default AddStockComponent;
