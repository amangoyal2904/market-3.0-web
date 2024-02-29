import React from "react";
import styles from "./MarketTable.module.scss";

interface PageSummary {
  totalRecords: number;
  totalpages: number;
  pagesize: number;
  pageno: number;
}

const Pagination = ({ pageSummary, onPageChange }: any) => {
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
    const ellipsis = <li className={styles.pageList}>...</li>;

    if (totalpages <= 5) {
      for (let i = 1; i <= totalpages; i++) {
        pageNumbers.push(
          <li
            key={i}
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
              key={i}
              className={`${styles.pageList} ${pageno === i ? styles.active : ""}`}
              onClick={() => onPageChange(i)}
            >
              {i}
            </li>,
          );
        }
        pageNumbers.push(ellipsis);
      } else if (pageno >= totalpages - 2) {
        pageNumbers.push(ellipsis);
        for (let i = totalpages - 4; i <= totalpages; i++) {
          pageNumbers.push(
            <li
              key={i}
              className={`${styles.pageList} ${pageno === i ? styles.active : ""}`}
              onClick={() => onPageChange(i)}
            >
              {i}
            </li>,
          );
        }
      } else {
        pageNumbers.push(ellipsis);
        for (let i = pageno - 2; i <= pageno + 2; i++) {
          pageNumbers.push(
            <li
              key={i}
              className={`${styles.pageList} ${pageno === i ? styles.active : ""}`}
              onClick={() => onPageChange(i)}
            >
              {i}
            </li>,
          );
        }
        pageNumbers.push(ellipsis);
      }
    }

    return pageNumbers;
  };

  return (
    <div
      id={styles.tablePagination}
      className={`dflex align-item-center space-between ${styles.m20}`}
    >
      <p>
        Showing {rangeStart}-{rangeEnd} of {totalRecords} stocks
      </p>
      <ul>
        <li
          className={`${styles.pageList} ${pageno === 1 ? styles.disabled : ""}`}
          onClick={() => handlePageChange(1)}
        >
          First
        </li>
        <li
          className={`${styles.pageList} ${pageno === 1 ? styles.disabled : ""}`}
          onClick={() => handlePageChange(pageno - 1)}
        >
          Prev
        </li>
        {renderPageNumbers()}
        <li
          className={`${styles.pageList} ${pageno === totalpages ? "disabled" : ""}`}
          onClick={() => handlePageChange(pageno + 1)}
        >
          Next
        </li>
        <li
          className={`${styles.pageList} ${pageno === totalpages ? "disabled" : ""}`}
          onClick={() => handlePageChange(totalpages)}
        >
          Last
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
