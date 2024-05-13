import { trackingEvent } from "@/utils/ga";
import styles from "./DayFilter.module.scss";
import React, { useRef, useEffect, useState } from "react";

const DayFitler = React.memo(
  ({
    selectedDay,
    setDayFilterShow,
    filterHandler,
    intradayDurationOptions,
  }: any) => {
    const FilterRadioData = intradayDurationOptions;
    const popupRef = useRef<HTMLDivElement | null>(null);
    const handleClickOutside = (event: any) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setDayFilterShow(false);
      }
    };

    const handleEscapeKey = (event: any) => {
      if (event.key === "Escape") {
        setDayFilterShow(false);
      }
    };
    const dayOnChangeHandler = (value: any, label: any) => {
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "duration_filter_applied",
        event_label: label,
      });
      filterHandler(value, label);
    };
    useEffect(() => {
      if (setDayFilterShow) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKey);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }, [setDayFilterShow]);
    return (
      <>
        <div className={`${styles.dayFilter}`} ref={popupRef}>
          <div className={`moduleBody ${styles.body}`}>
            <ul>
              {FilterRadioData.map((item: any, index: number) => {
                return (
                  <li
                    key={index}
                    onClick={() => dayOnChangeHandler(item.value, item.label)}
                    className={
                      selectedDay.value === item.value ? styles.active : ""
                    }
                  >
                    {item.label}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </>
    );
  },
);

DayFitler.displayName = "DayFitler";
export default DayFitler;
