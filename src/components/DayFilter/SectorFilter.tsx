import styles from "./DayFilter.module.scss";
import { fetchSectorFilters } from "@/utils/utility";
import React, { useEffect, useRef, useState } from "react";

const SectorFilter = ({
  setSectorFilterShow,
  sectorFilterData,
  sectorFilterHandler,
}: any) => {
  const [sectorOptions, setSectorOptions]: any[] = useState([]);
  const [selectedSector, setSelectedSector]: any[] = useState(null);
  const fetchSectorData = async () => {
    const data = await fetchSectorFilters();
    if (data && data.searchresult && data.searchresult.length > 0) {
      setSectorOptions(data.searchresult);
    }
  };
  const popupRef = useRef<HTMLDivElement | null>(null);
  const handleClickOutside = (event: any) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setSectorFilterShow(false);
    }
  };

  const handleEscapeKey = (event: any) => {
    if (event.key === "Escape") {
      setSectorFilterShow(false);
    }
  };
  const sectorOnChangeHandler = (sectorid: number, sectorname: string) => {
    setSelectedSector(sectorid);
    sectorFilterHandler(sectorid, sectorname);
  };

  useEffect(() => {
    if (setSectorFilterShow) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [setSectorFilterShow]);

  useEffect(() => {
    fetchSectorData();
  }, []);
  return (
    <>
      <div className={`${styles.dayFilter} customScroll`} ref={popupRef}>
        <div className={`moduleBody ${styles.body}`}>
          <ul>
            {sectorOptions.map((item: any, index: number) => {
              return (
                <li
                  key={index}
                  onClick={() =>
                    sectorOnChangeHandler(item.sectorid, item.sectorname)
                  }
                  className={
                    sectorFilterData.sectorid === item.sectorid
                      ? styles.active
                      : ""
                  }
                >
                  {item.sectorname}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SectorFilter;
