"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { APP_ENV } from "../../utils";
import APIS_CONFIG from "../../network/api_config.json";
import styles from "./Search.module.scss";
import SearchData from "./SearchData";
import { saveLogs } from "@/utils/utility";

const debounce = <T extends any[]>(
  func: (...args: T) => void,
  wait: number,
): ((...args: T) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: T) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

interface Props {
  location: string;
}

const Search: React.FC<Props> = ({ location }) => {
  const [data, setData] = useState([]);
  const [val, setVal] = useState("");
  const [loader, setLoader] = useState(false);
  const [searchEnable, setSearchEnable] = useState(false);
  const [newsData, setNewsData] = useState<any>();
  const [definitionData, setDefinitionData] = useState<any>();
  const [reportData, setReportData] = useState<any>();
  const ref = useRef<any>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (searchEnable) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchEnable]);
  const handleFocus = (query: string) => {
    if (!query) {
      const API_URL = (APIS_CONFIG as any)?.SEARCH.mostPopular[APP_ENV];
      fetch(API_URL)
        .then((response) => response.json())
        .then((res) => {
          setData(res);
          setSearchEnable(true);
        })
        .catch((err) => {
          console.log(err);
          saveLogs({
            type: "Mercury",
            res: "error",
            msg: "Search Most popular API Error" + err,
          });
        });
    }
  };
  const handleClickOutside = (event: any) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      ref.current.value = "";
      setSearchEnable(false);
    }
  };
  const fetchNameResults = (query: string) => {
    try {
      let requests = [];
      if (query) {
        const API_URL =
          (APIS_CONFIG as any)?.SEARCH.main[APP_ENV] + "&ticker=" + query;
        const NEWS_URL =
          (APIS_CONFIG as any)?.SEARCH.news["production"] + "?query=" + query;
        const DEFINITION_URL =
          (APIS_CONFIG as any)?.SEARCH.definition["production"] + "?q=" + query;
        const REPORT_URL =
          (APIS_CONFIG as any)?.SEARCH.report["production"] +
          "?keyword=" +
          query;
        setLoader(true);
        requests = [API_URL, NEWS_URL, DEFINITION_URL, REPORT_URL].map((url) =>
          fetch(url, {
            method: "GET",
          }),
        );
      } else {
        const API_URL = (APIS_CONFIG as any)?.SEARCH.mostPopular[APP_ENV];
        requests = [API_URL].map((url) =>
          fetch(url, {
            method: "GET",
          }),
        );
      }

      Promise.all(requests)
        .then((responses) =>
          responses.forEach((response, i) => {
            response
              .json()
              .then((result) => {
                if (i === 0) {
                  setData(result);
                } else if (i === 1) {
                  setNewsData(result);
                } else if (i === 2) {
                  setDefinitionData(result);
                } else if (i === 3) {
                  setReportData(result);
                }
                if (query) {
                  setVal(query);
                }
                setLoader(false);
                setSearchEnable(true);
              })
              .catch((error) => {
                console.error(`Data Fetch Error Inner: ${error}`);
                saveLogs({
                  type: "Mercury",
                  res: "error",
                  msg:
                    "Search Data API Promise Error" + error + "query= " + query,
                });
              });
          }),
        )
        .catch((error) => {
          console.error(`Data Fetch Error Outer: ${error}`);
        });
    } catch (e) {
      console.error(e);
      saveLogs({
        type: "Mercury",
        res: "error",
        msg: "Search Data API Catch Error" + e + "query= " + query,
      });
    }
  };
  const handleSearch = useCallback(
    debounce((inputVal) => fetchNameResults(inputVal), 500),
    [],
  );
  const handleClose = () => {
    ref.current.value = "";
    setSearchEnable(false);
  };

  return (
    <>
      {searchEnable && location == "header" && (
        <div className={styles.background_overlay}></div>
      )}
      <div
        className={`dflex ${styles[location + "_search"]}`}
        id={styles.searchBar}
        ref={popupRef}
      >
        <span className={`eticon_search ${styles.searchIcon}`}></span>
        <input
          autoComplete="off"
          name="ticker_newsearch"
          className={styles.inputBox}
          placeholder="Search Stocks, News, Mutual Funds, Crypto etc..."
          type="text"
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={(e) => {
            handleFocus(e.target.value);
          }}
          ref={ref}
          maxLength={100}
        />
        {searchEnable && (
          <>
            {loader ? (
              <div className={styles.loader}> </div>
            ) : (
              <div
                className={`${styles.right_icon} ${styles.close_search}`}
                onClick={handleClose}
              >
                X
              </div>
            )}

            <SearchData
              data={data}
              newsData={newsData}
              definitionData={definitionData}
              reportData={reportData}
              query={val}
              location={location}
            />
          </>
        )}
      </div>
    </>
  );
};
export default Search;
