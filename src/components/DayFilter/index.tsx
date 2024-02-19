import styles from "./DayFilter.module.scss";
import { useRef, useEffect, useState } from "react";

const DayFitler = ({
  selectedDay,
  setDayFilterShow,
  setDayFilterValueset,
}: any) => {
  const FilterRadioData = [
    { label: "1 Day", value: "1day", id: 1 },
    { label: "1 Week", value: "1week", id: 2 },
    { label: "1 Month", value: "1month", id: 3 },
    { label: "3 Months", value: "3months", id: 4 },
    { label: "6 Months", value: "6months", id: 5 },
    { label: "1 Year", value: "1year", id: 6 },
  ];
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
    setDayFilterValueset({ value, label });
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
