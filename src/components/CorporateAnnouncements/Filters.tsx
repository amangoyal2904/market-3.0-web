import { useState } from "react";

import CAApiTypeDropdown from "./DropdownComponent";
import styles from "./styles.module.scss";

const CorporateAnnouncementFilters = () => {
  const overviewOptions = [
    { label: "All Time", key: "alltime" },
    { label: "Today", key: "today" },
    { label: "Last 3 Days", key: "last3" },
    { label: "Last 7 Days", key: "last7" },
    { label: "Last 15 Days", key: "last15" },
    { label: "Last 30 Days", key: "last30" },
    { label: "Last 60 Days", key: "last60" },
  ];
  const [apiFilterShow, setApiFilterShow] = useState(false);
  const [apiType, setApiType] = useState(overviewOptions[0]);

  const onApiChangeHandler = (key: string, label: string) => {
    setApiType({ key: key, label: label });
    setApiFilterShow(false);
  };

  return (
    <div className="prel">
      <span
        className={`${styles.roundBtn} ${styles.fitlerDay}`}
        onClick={() => setApiFilterShow(true)}
      >
        {apiType.label} <i className="eticon_caret_down"></i>
      </span>
      {apiFilterShow && (
        <CAApiTypeDropdown
          selectedApiType={overviewOptions[0]}
          setApiFilterShow={setApiFilterShow}
          filterHandler={onApiChangeHandler}
          apiTypeOptions={overviewOptions}
        />
      )}
    </div>
  );
};

export default CorporateAnnouncementFilters;
