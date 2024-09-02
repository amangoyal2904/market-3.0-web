import React, { useEffect, useState } from "react";
import { fetchFilters, getPeerSectors } from "@/utils/utility";
import styles from "./SectorsDetails.module.scss";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import PerformanceAddPopUp from "./AddPopup/PerformanceAddPopUp";

const labels = ["", "1D", "1W", "1M", "3M", "6M", "1Y", "3Y", "5Y"];

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

const SectorsPerformance = React.memo(
  ({ data, indexName, sectorsListData }: any) => {
    const [peersData, setPeersData] = useState(data);
    const [showFilter, setShowFilter] = useState(false);
    const [filterMenuData, setFilterMenuData]: any = useState("");
    let assetIds = peersData.map((item: any) => item.assetId);
    const closePopup = () => {
      setShowFilter(false);
      document.body.style.overflow = "";
    };
    const showFilterMenu = (value: boolean) => {
      setShowFilter(value);
      if (value) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "";
    };

    const removePeerData = (id: any) => {
      const updatedAssetIds = assetIds.filter((item: any) => item !== id);
      assetIds = updatedAssetIds;
      const updatedPeerData = peersData.filter(
        (item: any) => item.assetId !== id,
      );
      setPeersData(updatedPeerData);
    };

    const handleChangeData = async (id: any, name: any) => {
      setShowFilter(false);
      document.body.style.overflow = "";
      const assetExists = assetIds.includes(id);
      if (!assetExists) {
        const updatedAssetIds = [...assetIds, id];
        assetIds = updatedAssetIds;
        const updatedPeerData = await getPeerSectors(assetIds.join(","));
        setPeersData(updatedPeerData);
      } else {
        toast((t) => (
          <span className="errorToast withRed">
            <b>{name}</b> Sectors is already added
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
        >{`Peer Performance of ${indexName} Sector v/s Market`}</h2>
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
                      href={`/stocks/sectors/${item.assetSeoName}`}
                      title={item.assetName}
                    >
                      {item.assetName}
                    </Link>
                    {index > 0 && (
                      <i
                        className="eticon_cross"
                        onClick={() => removePeerData(item.assetId)}
                      ></i>
                    )}
                  </div>
                </td>
                {getTdMarkup(item.r1Day)}
                {getTdMarkup(item.r1Week)}
                {getTdMarkup(item.r1Month)}
                {getTdMarkup(item.r3Month)}
                {getTdMarkup(item.r6Month)}
                {getTdMarkup(item.r1Year)}
                {getTdMarkup(item.r3Year)}
                {getTdMarkup(item.r5Year)}
              </tr>
            ))}
            {peersData.length < 5 && (
              <tr>
                <td colSpan={10} className={styles.left}>
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
          <PerformanceAddPopUp
            sectorsListData={sectorsListData}
            valuechange={handleChangeData}
            onClose={closePopup}
          />
        )}
      </>
    );
  },
);
SectorsPerformance.displayName = "SectorsPerformance";
export default SectorsPerformance;
