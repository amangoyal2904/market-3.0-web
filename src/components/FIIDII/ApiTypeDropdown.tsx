import styles from "../DayFilter/DayFilter.module.scss";
import React, { useRef, useEffect, useState } from "react";

const ApiTypeDropdown = React.memo(
  ({
    selectedApiType,
    setApiFilterShow,
    filterHandler,
    apiTypeOptions,
  }: any) => {
    const FilterRadioData = apiTypeOptions;
    const popupRef = useRef<HTMLDivElement | null>(null);
    const handleClickOutside = (event: any) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setApiFilterShow(false);
      }
    };

    const handleEscapeKey = (event: any) => {
      if (event.key === "Escape") {
        setApiFilterShow(false);
      }
    };
    const onChangeHandler = (value: any, label: any) => {
      filterHandler(value, label);
    };
    useEffect(() => {
      if (setApiFilterShow) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKey);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }, [setApiFilterShow]);
    return (
      <>
        <div className={`${styles.dayFilter}`} ref={popupRef}>
          <div className={`moduleBody ${styles.body}`}>
            <ul>
              {FilterRadioData.map((item: any, index: number) => {
                return (
                  <li
                    key={index}
                    onClick={() => onChangeHandler(item.key, item.label)}
                    className={
                      selectedApiType.key === item.key ? styles.active : ""
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

ApiTypeDropdown.displayName = "ApiTypeDropdown";
export default ApiTypeDropdown;
