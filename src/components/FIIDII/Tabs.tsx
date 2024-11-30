import React, { useState } from "react";
import styles from "./FIIDII.module.scss";
import ApiTypeDropdown from "./ApiTypeDropdown";
import { trackingEvent } from "@/utils/ga";

const tabData = [
  { label: "Overview", key: "overview" },
  { label: "Cash Provisional", key: "cash-provisional" },
  { label: "FII Cash", key: "fii-cash" },
  { label: "FII F&O", key: "fii-fno" },
  { label: "MF Cash", key: "mf-cash" },
];

const overviewOptions = [
  { label: "Cash", key: "FIIDIICash" },
  { label: "Index F&O", key: "IndexFandO" },
  { label: "Stock F&O", key: "FIIDIIStockFAndO" },
];

const FIIOptions = [
  { label: "Index", key: "index" },
  { label: "Stocks", key: "stock" },
];

const FiiDiiTabs = React.memo(
  ({ activeTab, handleApiType }: { activeTab: string; handleApiType: any }) => {
    const filterOptions =
      activeTab === "overview" ? overviewOptions : FIIOptions;
    const [apiFilterShow, setApiFilterShow] = useState(false);
    const [apiType, setApiType] = useState(filterOptions[0]);
    const onApiChangeHandler = (key: string, label: string) => {
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: `fiidii_category_filter_applied`,
        event_label: label,
      });
      setApiType({ key: key, label: label });
      handleApiType(key);
      setApiFilterShow(false);
    };

    return (
      <div className={styles.tabsWrap}>
        <ul className={styles.tabsList}>
          {tabData.map((item) => (
            <li
              key={item.key}
              className={`${styles.tabItem} ${
                activeTab === item.key ? styles.active : ""
              }`}
            >
              <a
                title={item.label}
                href={
                  item.key === "overview"
                    ? "/markets/fii-dii-activity"
                    : `/markets/fii-dii-activity/${item.key}`
                }
                onClick={(e) => {
                  trackingEvent("et_push_event", {
                    event_category: "mercury_engagement",
                    event_action: "tab_selected",
                    event_label: `FIIDII_${item.label}`,
                  });
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        {activeTab === "overview" || activeTab == "fii-fno" ? (
          <div className="prel">
            <span
              className={`${styles.roundBtn} ${styles.fitlerDay}`}
              onClick={() => setApiFilterShow(true)}
            >
              {apiType.label} <i className="eticon_caret_down"></i>
            </span>
            {apiFilterShow ? (
              <ApiTypeDropdown
                selectedApiType={apiType}
                setApiFilterShow={setApiFilterShow}
                filterHandler={onApiChangeHandler}
                apiTypeOptions={filterOptions}
              />
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
);

FiiDiiTabs.displayName = "FiiDiiTabs";
export default FiiDiiTabs;
