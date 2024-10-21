import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import styles from "./styles.module.scss";
import { trackingEvent } from "@/utils/ga";

interface StockSRFilterProps {
  data: {
    keyIndices: any;
    sectoralIndices: any;
    otherIndices: any;
    marketcap?: any;
    watchlist?: any;
    all: any;
  };
  onclick: (value: boolean) => void;
  valuechange: (id: string, name: string, selectedTab: string) => void;
  selectTab: string;
  childMenuTabActive?: string;
  showFilter: boolean;
}

export default function StockFilterNifty({
  data,
  onclick,
  valuechange,
  selectTab,
  childMenuTabActive,
  showFilter,
}: StockSRFilterProps) {
  const activeFilterValue = childMenuTabActive;

  const activeIndex = useMemo(() => {
    if (!activeFilterValue && !!data.all) return 5;
    if (!activeFilterValue && !!data.watchlist) return 4;
    const { keyIndices, sectoralIndices, otherIndices, marketcap } = data;

    if (
      keyIndices?.nse?.some((obj: any) => obj.indexId === activeFilterValue) ||
      keyIndices?.bse?.some((obj: any) => obj.indexId === activeFilterValue)
    ) {
      return 0;
    } else if (
      sectoralIndices?.nse?.some(
        (obj: any) => obj.indexId === activeFilterValue,
      ) ||
      sectoralIndices?.bse?.some(
        (obj: any) => obj.indexId === activeFilterValue,
      )
    ) {
      return 1;
    } else if (
      otherIndices?.nse?.some(
        (obj: any) => obj.indexId === activeFilterValue,
      ) ||
      otherIndices?.bse?.some((obj: any) => obj.indexId === activeFilterValue)
    ) {
      return 2;
    } else if (
      marketcap?.nse?.some((obj: any) => obj.indexId === activeFilterValue) ||
      marketcap?.bse?.some((obj: any) => obj.indexId === activeFilterValue)
    ) {
      return 3;
    } else if (!!marketcap) {
      return 4;
    } else {
      return 0;
    }
  }, [activeFilterValue, data]);

  const [nseBseMenuSelect, setNseBseMenuSelect] = useState(selectTab);
  const [activeItem, setActiveItem] = useState<number | null>(activeIndex);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = useCallback(
    (event: any) => {
      console.log("_______event", event);
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onclick(false);
      }
    },
    [onclick],
  );

  const handleEscapeKey = useCallback(
    (event: any) => {
      if (event.key === "Escape") {
        onclick(false);
      }
    },
    [onclick],
  );

  const nseBseMenu = useCallback((e: any) => {
    const selectedMenu = e.target.textContent.toLowerCase();
    setNseBseMenuSelect(selectedMenu);
  }, []);

  const handleItemClick = useCallback((index: number) => {
    setActiveItem(index);
  }, []);

  const clickFilterMenu = useCallback(
    (name: any, indexid: any) => {
      const selectedTab = nseBseMenuSelect;
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "index_filter_applied",
        event_label: name,
      });
      valuechange(indexid, name, selectedTab);
    },
    [nseBseMenuSelect, valuechange],
  );

  useEffect(() => {
    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showFilter, handleClickOutside, handleEscapeKey]);

  const renderSection = (sectionData: any, sectionIndex: number) => {
    return (
      <li
        onClick={() => handleItemClick(sectionIndex)}
        className={activeItem === sectionIndex ? styles.active : ""}
      >
        <div className={styles.subMenu}>
          <div className={styles.mainTxt}>
            {sectionData.name} <i className="eticon_caret_right"></i>
          </div>
          <ul className={styles.subMenuItem}>
            {(sectionData.nse || []).map((item: any, i: any) => (
              <li
                key={i}
                onClick={() => clickFilterMenu(item.name, item.indexId)}
                className={`${nseBseMenuSelect === "nse" ? styles.activelist : ""}`}
              >
                {item.name}{" "}
                {childMenuTabActive === item.indexId && (
                  <span className={styles.selectedMenu}>
                    <i className="eticon_tick"></i>
                  </span>
                )}
              </li>
            ))}
            {(sectionData.bse || []).map((item: any, i: any) => (
              <li
                key={i}
                onClick={() => clickFilterMenu(item.name, item.indexId)}
                className={`${nseBseMenuSelect === "bse" ? styles.activelist : ""}`}
              >
                {item.name}
                {childMenuTabActive === item.indexId && (
                  <span className={styles.selectedMenu}>
                    <i className="eticon_tick"></i>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  };

  return (
    <div className={styles.moduleWrap}>
      <div className={styles.filterWrap} ref={popupRef}>
        <div className={styles.topSec}>
          <div className={styles.leftSec}>
            <span>Filters</span>
          </div>
          <div className={styles.rightSec}>
            <ul className={styles.menuNseBse}>
              <li
                className={nseBseMenuSelect === "nse" ? styles.active : ""}
                onClick={nseBseMenu}
              >
                nse
              </li>
              <li
                className={nseBseMenuSelect === "bse" ? styles.active : ""}
                onClick={nseBseMenu}
              >
                bse
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.bottomSec}>
          <ul className={styles.filterMenu}>
            {(data?.keyIndices || {}).nse &&
              (data?.keyIndices || {}).bse &&
              renderSection(data.keyIndices, 0)}
            {(data?.sectoralIndices || {}).nse &&
              (data?.sectoralIndices || {}).bse &&
              renderSection(data.sectoralIndices, 1)}
            {(data?.otherIndices || {}).nse &&
              (data?.otherIndices || {}).bse &&
              renderSection(data.otherIndices, 2)}
            {(data?.marketcap || {}).nse &&
              (data?.marketcap || {}).bse &&
              renderSection(data.marketcap, 3)}
            {(data?.watchlist || {}).name && (
              <li
                onClick={() => handleItemClick(4)}
                className={activeItem === 4 ? styles.active : ""}
              >
                <div
                  className={styles.subMenu}
                  onClick={() =>
                    clickFilterMenu(data.watchlist.name, "watchlist")
                  }
                >
                  <div className={styles.mainTxt}>{data.watchlist.name}</div>
                </div>
              </li>
            )}
            {(data?.all || {}).name && (
              <li
                onClick={() => handleItemClick(5)}
                className={activeItem === 5 ? styles.active : ""}
              >
                <div
                  className={styles.subMenu}
                  onClick={() => clickFilterMenu(data.all.name, 0)}
                >
                  <div className={styles.mainTxt}>{data.all.name}</div>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
