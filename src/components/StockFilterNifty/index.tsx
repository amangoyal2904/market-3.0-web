import { useState, useRef, useEffect } from "react";
import styles from "./styles.module.scss";

interface StockSRFilterProps {
  data: { keyIndices: any; sectoralIndices: any; otherIndices: any; all: any };
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
  const activeIndex =
    (!!activeFilterValue &&
      data.keyIndices.nse.some(
        (obj: any) => obj.indexId == activeFilterValue,
      )) ||
    data?.keyIndices.bse.some((obj: any) => obj.indexId == activeFilterValue)
      ? 0
      : data.sectoralIndices.nse.some(
            (obj: any) => obj.indexId == activeFilterValue,
          ) ||
          data.sectoralIndices.bse.some(
            (obj: any) => obj.indexId == activeFilterValue,
          )
        ? 1
        : data.otherIndices.nse.some(
              (obj: any) => obj.indexId == activeFilterValue,
            ) ||
            data.otherIndices.bse.some(
              (obj: any) => obj.indexId == activeFilterValue,
            )
          ? 2
          : 3;
  const [nseBseMenuSelect, setNseBseMenuSelect] = useState(selectTab);
  const [activeItem, setActiveItem] = useState<number | null>(activeIndex);
  // const childTabMenuActive =
  //   childMenuTabActive && childMenuTabActive !== "" ? childMenuTabActive : "";
  const popupRef = useRef<HTMLDivElement | null>(null);
  const handleClickOutside = (event: any) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      onclick(false);
    }
  };

  const handleEscapeKey = (event: any) => {
    if (event.key === "Escape") {
      onclick(false);
    }
  };
  const nseBseMenu = (e: any) => {
    const selectedMenu = e.target.textContent.toLowerCase();
    setNseBseMenuSelect(selectedMenu);
  };
  const handleItemClick = (index: number) => {
    setActiveItem(index);
  };
  const clickFilterMenu = (name: any, indexid: any) => {
    const selectedTab = nseBseMenuSelect;
    valuechange(indexid, name, selectedTab);
  };
  useEffect(() => {
    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showFilter]);
  return (
    <div className={styles.moduleWrap}>
      <div className={styles.filterWrap} ref={popupRef}>
        <div className={styles.topSec}>
          <div className={styles.leftSec}>
            <span>Filter</span>
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
            {data && data.keyIndices && (
              <li
                onClick={() => handleItemClick(0)}
                className={activeItem === 0 ? styles.active : ""}
              >
                <div className={styles.subMenu}>
                  <div className={styles.mainTxt}>{data.keyIndices.name}</div>
                  <ul className={`${styles.subMenuItem}`}>
                    {data.keyIndices.nse.map((item: any, i: any) => {
                      return (
                        <li
                          key={i}
                          onClick={() =>
                            clickFilterMenu(item.name, item.indexId)
                          }
                          className={`${nseBseMenuSelect === "nse" ? styles.activelist : ""} ${
                            childMenuTabActive === item.indexId
                              ? styles.selectedMenu
                              : ""
                          }`}
                        >
                          {item.name}
                        </li>
                      );
                    })}
                    {data.keyIndices.bse.map((item: any, i: any) => {
                      return (
                        <li
                          key={i}
                          onClick={() =>
                            clickFilterMenu(item.name, item.indexId)
                          }
                          className={`${nseBseMenuSelect === "bse" ? styles.activelist : ""} ${
                            childMenuTabActive === item.indexId
                              ? styles.selectedMenu
                              : ""
                          }`}
                        >
                          {item.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            )}
            {data && data.sectoralIndices && (
              <li
                onClick={() => handleItemClick(1)}
                className={activeItem === 1 ? styles.active : ""}
              >
                <div className={styles.subMenu}>
                  <div className={styles.mainTxt}>
                    {data.sectoralIndices.name}
                  </div>
                  <ul className={styles.subMenuItem}>
                    {data.sectoralIndices.nse.map((item: any, i: any) => {
                      return (
                        <li
                          key={i}
                          onClick={() =>
                            clickFilterMenu(item.name, item.indexId)
                          }
                          className={`${nseBseMenuSelect === "nse" ? styles.activelist : ""} ${
                            childMenuTabActive === item.indexId
                              ? styles.selectedMenu
                              : ""
                          }`}
                        >
                          {item.name}
                        </li>
                      );
                    })}
                    {data.sectoralIndices.bse.map((item: any, i: any) => {
                      return (
                        <li
                          key={i}
                          onClick={() =>
                            clickFilterMenu(item.name, item.indexId)
                          }
                          className={`${nseBseMenuSelect === "bse" ? styles.activelist : ""} ${
                            childMenuTabActive === item.indexId
                              ? styles.selectedMenu
                              : ""
                          }`}
                        >
                          {item.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            )}
            {data && data.otherIndices && (
              <li
                onClick={() => handleItemClick(2)}
                className={activeItem === 2 ? styles.active : ""}
              >
                <div className={styles.subMenu}>
                  <div className={styles.mainTxt}>{data.otherIndices.name}</div>
                  <ul className={styles.subMenuItem}>
                    {data.otherIndices.nse.map((item: any, i: any) => {
                      return (
                        <li
                          key={i}
                          onClick={() =>
                            clickFilterMenu(item.name, item.indexId)
                          }
                          className={`${nseBseMenuSelect === "nse" ? styles.activelist : ""} ${
                            childMenuTabActive === item.indexId
                              ? styles.selectedMenu
                              : ""
                          }`}
                        >
                          {item.name}
                        </li>
                      );
                    })}
                    {data.otherIndices.bse.map((item: any, i: any) => {
                      return (
                        <li
                          key={i}
                          onClick={() =>
                            clickFilterMenu(item.name, item.indexId)
                          }
                          className={`${nseBseMenuSelect === "bse" ? styles.activelist : ""} ${
                            childMenuTabActive === item.indexId
                              ? styles.selectedMenu
                              : ""
                          }`}
                        >
                          {item.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            )}
            {data && data.all && (
              <li
                onClick={() => handleItemClick(3)}
                className={activeItem === 3 ? styles.active : ""}
              >
                <div
                  className={styles.subMenu}
                  onClick={() => clickFilterMenu(`${data.all.name} Stocks`, 0)}
                >
                  <div className={styles.mainTxt}>{data.all.name} Stocks</div>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
