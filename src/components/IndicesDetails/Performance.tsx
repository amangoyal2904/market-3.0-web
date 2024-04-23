import styles from "./IndicesDetails.module.scss";
import StockFilterNifty from "../StockFilterNifty";
import { useEffect, useState } from "react";
import { fetchFilters, getPeerIndices } from "@/utils/utility";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

const labels = ["", "1D", "1W", "1M", "3M", "1Y", "3Y", "5Y"];

const getTdMarkup = (value: number) => {
  const trend = value > 0 ? "up" : value < 0 ? "down" : "neutral";
  return (
    <td
      className={`${styles.center} ${trend == "up" ? styles.up : trend == "down" ? styles.down : ""}`}
    >
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
      {value}
    </td>
  );
};

const IndicesPerformance = ({ data, indexName, niftyFilterData = {} }: any) => {
  const [peersData, setPeersData] = useState(data);
  const [showFilter, setShowFilter] = useState(false);
  const [filterMenuData, setFilterMenuData]: any = useState("");
  let indexIds = peersData.map((item: any) => item.indexId);

  const showFilterMenu = (value: boolean) => {
    setShowFilter(value);
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
    const indexExists = indexIds.includes(id);

    if (!indexExists) {
      const updatedIndexIds = [...indexIds, id];
      indexIds = updatedIndexIds;
      const updatedPeerData = await getPeerIndices(indexIds.join(","));
      setPeersData(updatedPeerData);
    } else {
      toast((t) => (
        <span className={styles.errorToast}>
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
      <h2 className={styles.heading}>
        Performance of {indexName} v/s Other Indices
      </h2>
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
              <td className={styles.left}>
                <div className="dflex align-item-ceter space-between">
                  <Link
                    href={`/markets/indices/${item.indexSeoName}`}
                    target="_blank"
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
          selectTab={niftyFilterData.exchange}
          childMenuTabActive={niftyFilterData.indexId}
        />
      )}
      <Toaster position="bottom-left" reverseOrder={false} />
    </>
  );
};

export default IndicesPerformance;
