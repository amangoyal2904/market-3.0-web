import styles from "./IndicesDetails.module.scss";
import StockFilterNifty from "../StockFilterNifty";
import React, { useEffect, useState } from "react";
import { fetchFilters, getPeerIndices } from "@/utils/utility";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

const labels = ["", "1D", "1W", "1M", "3M", "1Y", "3Y", "5Y"];

const getTdMarkup = (value: number) => {
  const trend = value > 0 ? "up" : value < 0 ? "down" : "neutral";
  return (
    <td
      className={trend == "up" ? styles.up : trend == "down" ? styles.down : ""}
    >
      {`${value != null ? value + "%" : "-"}`}
      {trend && (
        <span
          className={`${styles.arrowIcons} ${
            trend == "up"
              ? "eticon_up_arrow"
              : trend == "down"
                ? "eticon_down_arrow"
                : ""
          }`}
        />
      )}
    </td>
  );
};

const IndicesPerformance = React.memo(({ data, indexName, exchange }: any) => {
  const [peersData, setPeersData] = useState(data);
  const [showFilter, setShowFilter] = useState(false);
  const [filterMenuData, setFilterMenuData]: any = useState("");
  let indexIds = peersData.map((item: any) => item.indexId);

  const showFilterMenu = (value: boolean) => {
    setShowFilter(value);
    if (value) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  };

  const removePeerData = (id: any) => {
    const updatedIndexIds = indexIds.filter((item: any) => item !== id);
    indexIds = updatedIndexIds;

    const updatedPeerData = peersData.filter(
      (item: any) => item.indexId !== id,
    );
    setPeersData(updatedPeerData);
  };

  const handleChangeData = async (id: any, name: any) => {
    setShowFilter(false);
    document.body.style.overflow = "";
    const indexExists = indexIds.includes(id);
    if (!indexExists) {
      const updatedIndexIds = [...indexIds, id];
      indexIds = updatedIndexIds;
      const updatedPeerData = await getPeerIndices(indexIds.join(","));
      setPeersData(updatedPeerData);
    } else {
      toast((t) => (
        <span className="errorToast withRed">
          <b>{name}</b> Indices is already added
          <button onClick={() => toast.dismiss(t.id)}>
            <i className="eticon_cross"></i>
          </button>
        </span>
      ));
    }
  };

  const filterApiCall = async () => {
    const data = await fetchFilters({});
    setFilterMenuData(data);
  };
  useEffect(() => {
    filterApiCall();
  }, []);

  return (
    <>
      <h2
        className={styles.heading}
      >{`Performance of ${indexName} v/s Other Indices`}</h2>
      <table className={styles.marketsCustomTable}>
        <thead>
          <tr>
            {labels.map((label, index) => (
              <th key={index} className={styles.center}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {peersData.map((item: any, index: number) => (
            <tr key={index} className={index == 0 ? styles.primeCell : ""}>
              <td className={`${styles.left} ${styles.mw150}`}>
                <div className="dflex align-item-ceter space-between">
                  <Link
                    className={styles.ellipsis}
                    href={`/markets/indices/${item.indexSeoName}`}
                    title={item.indexName}
                  >
                    {item.indexName}
                  </Link>
                  {index > 0 && (
                    <i
                      className="eticon_cross"
                      onClick={() => removePeerData(item.indexId)}
                    ></i>
                  )}
                </div>
              </td>
              {getTdMarkup(item.percentChange)}
              {getTdMarkup(item.r1Week)}
              {getTdMarkup(item.r1Month)}
              {getTdMarkup(item.r3Month)}
              {getTdMarkup(item.r1Year)}
              {getTdMarkup(item.r3Year)}
              {getTdMarkup(item.r5Year)}
            </tr>
          ))}
          {peersData.length < 5 && (
            <tr>
              <td colSpan={8} className={styles.left}>
                <span
                  className={styles.link}
                  onClick={() => showFilterMenu(true)}
                >
                  Add More
                </span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {showFilter && (
        <StockFilterNifty
          data={filterMenuData}
          onclick={showFilterMenu}
          showFilter={showFilter}
          valuechange={handleChangeData}
          selectTab={exchange.toLowerCase()}
        />
      )}
    </>
  );
});
IndicesPerformance.displayName = "IndicesPerformance";
export default IndicesPerformance;
