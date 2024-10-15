import React, { useState } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";
import CAApiTypeDropdown from "./CAApiTypeDropdown";
import { trackingEvent } from "@/utils/ga";

const tabData = [
  { label: "Dividend", key: "dividend" },
  { label: "Bonus", key: "bonus" },
  { label: "Board Meetings", key: "board-meetings" },
  { label: "AGM/EGM", key: "agm-egm" },
  { label: "Splits", key: "splits" },
  { label: "Rights", key: "rights" },
];

const overviewOptions = [
  { label: "Cash", key: "FIIDIICash" },
  { label: "Index F&O", key: "IndexFandO" },
  { label: "Stock F&O", key: "FIIDIIStockFAndO" },
];

const CorporateActionseTabs = React.memo(
  ({ activeTab, handleApiType }: { activeTab: string; handleApiType: any }) => {
    const [apiFilterShow, setApiFilterShow] = useState(false);
    const [apiType, setApiType] = useState(overviewOptions[0]);
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
              <Link
                title={item.label}
                href={
                  item.key === "overview"
                    ? "/markets/corporate-actions"
                    : `/markets/corporate-actions/${item.key}`
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
              </Link>
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
              <CAApiTypeDropdown
                selectedApiType={apiType}
                setApiFilterShow={setApiFilterShow}
                filterHandler={onApiChangeHandler}
                apiTypeOptions={overviewOptions}
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
  },
);

CorporateActionseTabs.displayName = "CorporateActionseTabs";
export default CorporateActionseTabs;
