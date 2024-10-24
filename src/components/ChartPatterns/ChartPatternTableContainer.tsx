import useDebounce from "@/hooks/useDebounce";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ChartPatternTableContainer.module.scss";
import { dateFormat, formatNumber } from "@/utils";
import { getStockUrl } from "@/utils/utility";
import { Pattern, PatternData } from "./types";

interface ChartPatternTableContainerProps extends PatternData {
  fixedHeader?: boolean; // Optional prop with default value
}

const ChartPatternTableContainer = ({
  pastPatternList,
  subPatternFlag,
  fixedHeader = true, // default value is true
}: ChartPatternTableContainerProps) => {
  const { debounce } = useDebounce();
  const [parentHasScroll, setParentHasScroll] = useState(false);
  const [rightScrollEnabled, setRightScrollEnabled] = useState(true);
  const [leftScrollEnabled, setLeftScrollEnabled] = useState(false);
  const [showCustomScroll, setShowCustomScroll] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const fixedTableRef = useRef<HTMLDivElement | null>(null);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const tableWrapperRef = useRef<HTMLDivElement | null>(null);

  const onRowHover = (rowIndex: number, isHovering: boolean) => {
    const fixedTable = fixedTableRef.current;
    const scrollableTable = scrollableRef.current;

    if (fixedTable && scrollableTable) {
      const fixedTableRow = fixedTable.querySelectorAll("tbody tr")[rowIndex];
      const scrollableTableRow =
        scrollableTable.querySelectorAll("tbody tr")[rowIndex];

      if (isHovering) {
        fixedTableRow.classList.add(styles.highlightedRow);
        scrollableTableRow.classList.add(styles.highlightedRow);
      } else {
        fixedTableRow.classList.remove(styles.highlightedRow);
        scrollableTableRow.classList.remove(styles.highlightedRow);
      }
    }
  };

  const handleMouseEnter = () => setShowCustomScroll(true);
  const handleMouseLeave = () => setShowCustomScroll(false);

  const rightClickScroll = useCallback(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollLeft += 100;
    }
  }, []);

  const leftClickScroll = useCallback(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollLeft -= 100;
    }
  }, []);

  const handleWindowScroll = useCallback(
    debounce(() => {
      if (!tableWrapperRef.current) return;

      const tableWrapperTop =
        tableWrapperRef.current.getBoundingClientRect().top + window.scrollY;
      const scrollY = window.scrollY;
      const stickyHeight = 100;

      // Only run this block if fixedHeader is true
      if (fixedHeader) {
        if (scrollY > tableWrapperTop - 70) {
          setTranslateY(scrollY - tableWrapperTop + stickyHeight);
        } else {
          setTranslateY(0);
        }
      }
    }, 10),
    [debounce, fixedHeader],
  );

  useEffect(() => {
    if (fixedHeader) {
      window.addEventListener("scroll", handleWindowScroll, {
        passive: true,
      });
      return () => {
        window.removeEventListener("scroll", handleWindowScroll);
      };
    }
  }, [handleWindowScroll, fixedHeader]);

  useEffect(() => {
    const parent = scrollableRef.current;
    const theadElement = parent?.querySelector("thead > tr > th");
    const fixedTable = document.querySelector("#fixedTable");
    const hasScroll = parent ? parent.scrollWidth > parent.clientWidth : false;
    setParentHasScroll(hasScroll);

    if (theadElement) {
      const height = theadElement.getBoundingClientRect().height;
      const thElements = fixedTable?.querySelectorAll("th");
      thElements?.forEach((th) => {
        th.style.height = `${height}px`;
      });
    }

    const handleScroll = debounce(() => {
      if (parent) {
        const maxScrollLeft = parent.scrollWidth - parent.clientWidth;
        setLeftScrollEnabled(parent.scrollLeft > 0);
        setRightScrollEnabled(parent.scrollLeft < maxScrollLeft);
      }
    }, 100);

    parent?.addEventListener("scroll", handleScroll);
    return () => {
      parent?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={styles.tableWrapper}
      id="table"
      ref={tableWrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        id="fixedTable"
        ref={fixedTableRef}
        className={`${styles.fixedWrapper} ${!!parentHasScroll ? styles.withShadow : ""}`}
      >
        <table className={styles.marketsCustomTable}>
          <thead
            style={{
              transition: "transform 0.1s ease 0s",
              transform: fixedHeader ? `translateY(${translateY}px)` : "none", // Conditionally apply transform
            }}
            className={styles.thead}
          >
            <tr>
              <th className={styles.left}>Stock Name</th>
            </tr>
          </thead>
          <tbody>
            {pastPatternList.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onMouseEnter={() => onRowHover(rowIndex, true)}
                onMouseLeave={() => onRowHover(rowIndex, false)}
              >
                <td className={styles.firstColumn}>
                  <a
                    href={getStockUrl(
                      row.companyId,
                      row.companySeoName,
                      "equity",
                    )}
                    title={row.companyName}
                    className={styles.stName}
                    target="_blank"
                  >
                    {row.companyName}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        id="scrollableTable"
        className={styles.scrollableWrapper}
        ref={scrollableRef}
      >
        <table className={styles.marketsCustomTable}>
          <thead
            style={{
              transition: "transform 0.1s ease 0s",
              transform: fixedHeader ? `translateY(${translateY}px)` : "none", // Conditionally apply transform
            }}
            className={styles.thead}
          >
            <tr>
              {!subPatternFlag && <th>Pattern Formed</th>}
              <th>Formed On</th>
              <th>Breakout Price</th>
              <th>Return %</th>
              <th>Days</th>
              <th>Market Cap (Rs Cr)</th>
              <th className={styles.left}>Industry</th>
              <th
                className={`${styles.fullWidth} ${styles.noRborder} ${!!parentHasScroll ? styles.hide : ""}`}
              ></th>
            </tr>
          </thead>
          <tbody>
            {pastPatternList.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onMouseEnter={() => onRowHover(rowIndex, true)}
                onMouseLeave={() => onRowHover(rowIndex, false)}
              >
                {!subPatternFlag && (
                  <td className={styles.ft10}>
                    <span className={styles.bull}>{row.patternName}</span>
                  </td>
                )}
                <td className={styles.txtBlack}>
                  {dateFormat(row.patternFormedDate, "%d %MMM %Y")}
                </td>
                <td className="numberFonts">
                  {formatNumber(row?.breakoutPrice?.toFixed(2))}
                </td>
                <td
                  className={
                    row.stockReturn < 0 ? "numberFonts down" : "numberFonts up"
                  }
                >
                  {`${row.stockReturn}%`}
                  <span
                    className={`${styles.arrowIcons} ${
                      row.stockReturn < 0
                        ? "eticon_down_arrow"
                        : "eticon_up_arrow"
                    }`}
                  />
                </td>
                <td>
                  <span className="numberFonts">
                    {row.returnTimeframe} days
                  </span>
                </td>
                <td className="numberFonts">
                  {formatNumber(row?.marketCap?.toFixed(2))}
                </td>
                <td className={styles.left}>{row.industryName}</td>
                <td
                  className={`${styles.fullWidth} ${styles.noRborder} ${!!parentHasScroll ? styles.hide : ""}`}
                ></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!!parentHasScroll && showCustomScroll && (
        <div id="customScroll" className={styles.horizontalCustomScroll}>
          <button
            id="scrollButton_l"
            onClick={leftClickScroll}
            className={`${styles.scrollButton} ${!leftScrollEnabled ? styles.disableBtn : ""}`}
            disabled={!leftScrollEnabled}
          >
            &#8592;
          </button>
          <span />
          <button
            id="scrollButton_r"
            onClick={rightClickScroll}
            className={`${styles.scrollButton} ${!rightScrollEnabled ? styles.disableBtn : ""}`}
            disabled={!rightScrollEnabled}
          >
            &#8594;
          </button>
        </div>
      )}
    </div>
  );
};

export default ChartPatternTableContainer;
