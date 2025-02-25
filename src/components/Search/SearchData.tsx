import React, { useEffect, useState } from "react";
import styles from "./Search.module.scss";
import { filterData } from "@/utils";
import SearchDataLi from "./SearchDataLi";
import { getStockUrl } from "@/utils/utility";
import SearchNews from "./SearchNews";
import SearchNewsPrime from "./SearchNewsPrime";

interface Props {
  data: any;
  newsData: any;
  definitionData: any;
  reportData: any;
  query: string;
  pos: string;
}

const SearchData: React.FC<Props> = ({
  data,
  newsData,
  definitionData,
  reportData,
  query,
  pos,
}) => {
  const [companyListed, setCompanyListed] = useState<any>([]);
  const [companyNonListed, setCompanyNonListed] = useState<any>([]);
  const [mf, setMf] = useState<any>([]);
  const [nps, setNps] = useState<any>([]);
  const [etf, setEtf] = useState<any>([]);
  const [crypto, setCrypto] = useState<any>([]);
  const [forex, setForex] = useState<any>([]);
  const [commodity, setCommodity] = useState<any>([]);
  const [index, setIndex] = useState<any>([]);
  const [newsPrime, setNewsPrime] = useState<any>([]);
  const records = {
    compcount: 6,
    coincount: 2,
    mfcount: 2,
    npscount: 2,
    cmdtcount: 2,
    inetcount: 2,
    defcount: 2,
    forexcount: 2,
    indicescount: 2,
    etfcount: 2,
    nonlistcount: 3,
    newscount: 6,
  };

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const filteredListed = data.filter(
        (item) =>
          (item.entityType.toLowerCase() === "company" &&
            item?.subType !== "NonList") ||
          item.entityType === "dvr" ||
          item.entityType === "pp" ||
          item.entityType === "idr" ||
          item.entityType === "dvr",
      );
      setCompanyListed(filteredListed);
      const filteredNonListed = data.filter(
        (item) =>
          item.entityType.toLowerCase() === "company" &&
          item.subType &&
          item.subType.toLowerCase() === "nonlist",
      );
      setCompanyNonListed(filteredNonListed);
      setIndex(filterData(data, "index"));
      if (newsData && Array.isArray(newsData)) {
        const filterPrimeData = newsData.filter((item: any) =>
          item.link.includes("/prime/"),
        );
        setNewsPrime(filterPrimeData);
      }
      setMf(filterData(data, "MutualFund"));
      setNps(filterData(data, "NPS"));
      setEtf(filterData(data, "ETF"));
      setCrypto(filterData(data, "crypto"));
      setForex(filterData(data, "forex"));
      setCommodity(filterData(data, "commodity"));
    }
  }, [data, newsData]);

  return (
    <div className={`${styles.searchResult} ${styles[pos + "_searchResult"]}`}>
      <div className={styles.searchListed}>
        <ul>
          {data && Array.isArray(data) ? (
            <>
              {companyListed.length > 0 && (
                <SearchDataLi
                  item={companyListed}
                  entity={"Companies"}
                  count={records.compcount}
                  query={query}
                />
              )}
              {companyNonListed.length > 0 && (
                <SearchDataLi
                  item={companyNonListed}
                  entity={"Non Listed Companies"}
                  count={records.nonlistcount}
                  query={query}
                />
              )}
              {index.length > 0 && (
                <SearchDataLi
                  item={index}
                  entity={"INDEX"}
                  count={records.inetcount}
                  query={query}
                />
              )}
              {mf.length > 0 && (
                <SearchDataLi
                  item={mf}
                  entity={"Mutual Funds"}
                  count={records.nonlistcount}
                  query={query}
                />
              )}
              {nps.length > 0 && (
                <SearchDataLi
                  item={nps}
                  entity={"NPS"}
                  count={records.nonlistcount}
                  query={query}
                />
              )}
              {etf.length > 0 && (
                <SearchDataLi
                  item={etf}
                  entity={"ETF"}
                  count={records.nonlistcount}
                  query={query}
                />
              )}
              {crypto.length > 0 && (
                <SearchDataLi
                  item={crypto}
                  entity={"CRYPTOCURRENCY"}
                  count={records.coincount}
                  query={query}
                />
              )}
              {forex.length > 0 && (
                <SearchDataLi
                  item={forex}
                  entity={"FOREX"}
                  count={records.forexcount}
                  query={query}
                />
              )}
              {commodity.length > 0 && (
                <SearchDataLi
                  item={commodity}
                  entity={"COMMODITY"}
                  count={records.cmdtcount}
                  query={query}
                />
              )}
              {definitionData &&
              definitionData.person &&
              Array.isArray(definitionData.person) &&
              definitionData.person.length > 0 ? (
                <SearchNews
                  item={definitionData.person}
                  entity={"PEOPLE"}
                  count={records.newscount}
                  query={query}
                />
              ) : (
                ""
              )}
              {newsPrime.length > 0 && (
                <SearchNewsPrime
                  item={newsPrime}
                  entity={"PRIME NEWS"}
                  count={records.newscount}
                  query={query}
                />
              )}
              {newsData && Array.isArray(newsData) && newsData.length > 0 ? (
                <SearchNews
                  item={newsData}
                  entity={"NEWS"}
                  count={records.newscount}
                  query={query}
                />
              ) : (
                ""
              )}
              {reportData &&
              Array.isArray(reportData) &&
              reportData.length > 0 ? (
                <SearchNews
                  item={reportData}
                  entity={"REPORTER"}
                  count={records.newscount}
                  query={query}
                />
              ) : (
                ""
              )}
              {companyListed.length == 0 &&
              companyNonListed.length == 0 &&
              mf.length == 0 &&
              etf.length == 0 &&
              crypto.length == 0 &&
              forex.length == 0 &&
              commodity.length == 0 &&
              index.length == 0 &&
              newsPrime.length == 0 &&
              newsData &&
              Array.isArray(newsData) &&
              newsData.length == 0 &&
              reportData &&
              Array.isArray(reportData) &&
              reportData.length == 0 ? (
                <p className={styles.noRecord}>No Record Found!!</p>
              ) : (
                ""
              )}
            </>
          ) : (
            <>
              <li className={styles.head}>MOST POPULAR STOCKS</li>
              {data &&
                data.searchresult &&
                data.searchresult.map((item: any, index: number) => (
                  <li key={index} className={styles.searchliMost}>
                    <a
                      href={getStockUrl(
                        item.companyid,
                        item.seoname,
                        item.companytype,
                      )}
                      title={item.companyname}
                      target="_blank"
                    >
                      <div className={styles.st_row}>
                        <div className={styles.st_col}>{item.companyname}</div>
                        <div
                          className={`numberFonts ${styles.st_col} ${styles.st_change} ${styles.st_mid_col}`}
                        >
                          <span
                            className={`numberFonts ${Number(item.absolutechange) > 0 ? "eticon_up_arrow green" : "eticon_down_arrow red"}`}
                          ></span>
                          <span>{item.current}</span>
                        </div>
                        <div
                          className={`${styles.st_col} ${Number(item.absolutechange) > 0 ? "green" : "red"}`}
                        >
                          {item.absolutechange}
                        </div>
                      </div>
                      <div className={`${styles.st_row} ${styles.st_last}`}>
                        <div className={styles.st_col}>
                          {item.updateddatetime}
                        </div>
                        <div
                          className={`${styles.st_col} ${styles.st_mid_col}`}
                        >
                          Vol. <span>{item.volumeInThousand}</span>k
                        </div>
                        <div
                          className={`${styles.st_col} ${Number(item.absolutechange) > 0 ? "green" : "red"}`}
                        >
                          {item.percentagechange}%
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchData;
