"use client";

import { useState, useEffect } from "react";

import styles from "./industryFilter.module.scss";
import { fetchIndustryFilters } from "../../utils/utility";
import { trackingEvent } from "@/utils/ga";

const IndustryFilter = ({
  onclose,
  industrySelectedFilter,
  defaultCheck,
}: any) => {
  const [filteData, setFilterData]: any[] = useState([]);

  const fetchIndustryData = async () => {
    const data = await fetchIndustryFilters(
      "?exchange=50&ismobile=true&datatype=industry",
    );
    if (data && data.searchresult && data.searchresult.length > 0) {
      setFilterData(data.searchresult);
    }
  };
  useEffect(() => {
    fetchIndustryData();
  }, []);
  return (
    <>
      <div className={`${styles.dayFilter}`}>
        <div className={styles.overlay} onClick={onclose}></div>
        <div className={`${styles.wrap}`}>
          <div className={`${styles.header}`}>Select Industry Filter</div>
          <div className={`moduleBody ${styles.body}`}>
            <ul className="customScroll">
              {filteData && filteData.length > 0
                ? filteData.map((item: any, index: number) => {
                    return (
                      <li key={item.id}>
                        <input
                          id={item.id}
                          type="checkbox"
                          name={item.name}
                          value={item.id}
                          checked={defaultCheck.includes(item.id)}
                          onChange={(e: any) => {
                            trackingEvent("et_push_event", {
                              event_category: "mercury_engagement",
                              event_action: "industry_filter_applied",
                              event_label: item.name,
                            });
                            industrySelectedFilter(e);
                          }}
                        />
                        <label htmlFor={item.id}>{item.name}</label>
                      </li>
                    );
                  })
                : ""}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndustryFilter;
