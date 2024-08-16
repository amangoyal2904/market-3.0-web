import React, { useState, useEffect, useRef } from "react";
import styles from "./AddPopup.module.scss";

const PerformanceAddPopUp = ({
  sectorsListData,
  valuechange,
  onClose,
}: any) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [searchList, setSearchList] = useState("");
  const filteredItems = sectorsListData.filter((item: any) =>
    item.assetName.toLowerCase().includes(searchList.toLowerCase()),
  );
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Attach the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles.moduleWrap}>
      <div className={styles.filterWrap} ref={popupRef}>
        <div className={styles.headerBox}>
          <span>Select Sector</span>
          <span className={styles.closePopUp} onClick={onClose}></span>
        </div>
        <div className={styles.searchSectorBox}>
          <div className={styles.searchIconBox}>
            <span className={styles.sreachIcon}></span>
            <input
              type="text"
              placeholder="Search items..."
              value={searchList}
              onChange={(e) => setSearchList(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.sectorListBox}>
          <ul>
            {filteredItems.map((sector: any) => (
              <li
                key={sector.assetId}
                data-id={sector.assetId}
                onClick={() => valuechange(sector.assetId, sector.assetName)}
              >
                {sector.assetName}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAddPopUp;
