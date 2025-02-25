import React from "react";
import styles from "./MarketTable.module.scss";

interface PageSummary {
  totalRecords: number;
  totalpages: number;
  pagesize: number;
  pageno: number;
}

const Pagination = React.memo(({ pageSummary, onPageChange }: any) => {
  const { totalRecords, totalpages, pagesize, pageno } = pageSummary;

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalpages) {
      onPageChange(pageNumber);
    }
  };

  // Calculate range of records being displayed
  const rangeStart = (pageno - 1) * pagesize + 1;
  const rangeEnd = Math.min(pageno * pagesize, totalRecords);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (totalpages <= 5) {
      for (let i = 1; i <= totalpages; i++) {
        pageNumbers.push(
          <li
            key={`page_${i}`}
            className={`${styles.pageList} ${pageno === i ? styles.active : ""}`}
            onClick={() => onPageChange(i)}
          >
            {i}
          </li>,
        );
      }
    } else {
      if (pageno <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(
            <li
              key={`page_${i}`}
              className={`${styles.pageList} ${pageno === i ? styles.active : ""}`}
              onClick={() => onPageChange(i)}
            >
              {i}
            </li>,
          );
        }
        pageNumbers.push(
          <li key="ellipses_1" className={styles.pageList}>
            ...
          </li>,
        );
      } else if (pageno >= totalpages - 2) {
        pageNumbers.push(
          <li key="ellipses_2" className={styles.pageList}>
            ...
          </li>,
        );
        for (let i = totalpages - 4; i <= totalpages; i++) {
          pageNumbers.push(
            <li
              key={`page_${i}`}
              className={`${styles.pageList} ${pageno === i ? styles.active : ""}`}
              onClick={() => onPageChange(i)}
            >
              {i}
            </li>,
          );
        }
      } else {
        pageNumbers.push(
          <li key="ellipses_3" className={styles.pageList}>
            ...
          </li>,
        );
        for (let i = pageno - 2; i <= pageno + 2; i++) {
          pageNumbers.push(
            <li
              key={`page_${i}`}
              className={`${styles.pageList} ${pageno === i ? styles.active : ""}`}
              onClick={() => onPageChange(i)}
            >
              {i}
            </li>,
          );
        }
        pageNumbers.push(
          <li key="ellipses_4" className={styles.pageList}>
            ...
          </li>,
        );
      }
    }

    return pageNumbers;
  };

  return (
    <div
      id={styles.tablePagination}
      className={`dflex align-item-center space-between ${styles.m20}`}
    >
      <p>{`Showing ${rangeStart}-${rangeEnd} of ${totalRecords} Stocks`}</p>
      <ul>
        {/* <li
          className={`${styles.pageList} ${pageno === 1 ? styles.disabled : ""}`}
          onClick={() => handlePageChange(1)}
        >
          <i className="eticon_chevron_left"></i>
        </li> */}
        <li
          className={`${styles.pageList} ${pageno === 1 ? styles.disabled : ""}`}
          onClick={() => handlePageChange(pageno - 1)}
        >
          Previous
        </li>
        {renderPageNumbers()}
        <li
          className={`${styles.pageList} ${pageno === totalpages ? styles.disabled : ""}`}
          onClick={() => handlePageChange(pageno + 1)}
        >
          Next
        </li>
        {/* <li
          className={`${styles.pageList} ${pageno === totalpages ? styles.disabled : ""}`}
          onClick={() => handlePageChange(totalpages)}
        >
          <i className="eticon_chevron_right"></i>
        </li> */}
      </ul>
    </div>
  );
});
Pagination.displayName = "Pagination";
export default Pagination;
