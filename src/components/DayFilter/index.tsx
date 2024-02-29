import { durationOptions } from "@/utils/utility";
import styles from "./DayFilter.module.scss";
import { useRef, useEffect, useState } from "react";

const DayFitler = ({ selectedDay, setDayFilterShow, filterHandler }: any) => {
  const FilterRadioData = durationOptions;
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
      <div className={`customeModule ${styles.dayFilter}`}>
        <div className={`moduleWrap ${styles.wrap}`} ref={popupRef}>
          <div className={`moduleHeader ${styles.header}`}>
            Select Date Range
          </div>
          <div className={`moduleBody ${styles.body}`}>
            <ul>
              {FilterRadioData.map((item: any) => {
                return (
                  <li key={item.id}>
                    <input
                      id={item.id}
                      onChange={() =>
                        dayOnChangeHandler(item.value, item.label)
                      }
                      type="radio"
                      checked={selectedDay.value === item.value}
                      name="dayFilter"
                      value={item.value}
                    />
                    <label htmlFor={item.id}>{item.label}</label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default DayFitler;
