import React from "react";
import styles from "./styles.module.scss";

interface PageSummary {
  totalRecords: number;
  totalPages: number;
  pageSize: number;
  pageNo: number;
}

const Pagination = ({ pageSummary, onPageChange, paginationLastNode }: any) => {
  const { totalRecords, totalPages, pageSize, pageNo } = pageSummary;

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  // Calculate range of records being displayed
  const rangeStart = (pageNo - 1) * pageSize + 1;
  const rangeEnd = Math.min(pageNo * pageSize, totalRecords);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <li
            key={`page_${i}`}
            className={`${styles.pageList} ${pageNo === i ? styles.active : ""}`}
            onClick={() => onPageChange(i)}
          >
            {i}
          </li>,
        );
      }
    } else {
      if (pageNo <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(
            <li
              key={`page_${i}`}
              className={`${styles.pageList} ${pageNo === i ? styles.active : ""}`}
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
      } else if (pageNo >= totalPages - 2) {
        pageNumbers.push(
          <li key="ellipses_2" className={styles.pageList}>
            ...
          </li>,
        );
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(
            <li
              key={`page_${i}`}
              className={`${styles.pageList} ${pageNo === i ? styles.active : ""}`}
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
        for (let i = pageNo - 2; i <= pageNo + 2; i++) {
          pageNumbers.push(
            <li
              key={`page_${i}`}
              className={`${styles.pageList} ${pageNo === i ? styles.active : ""}`}
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
      <p>
        Showing {rangeStart}-{rangeEnd} of {totalRecords} {paginationLastNode}
      </p>
      <ul>
        <li
          className={`${styles.pageList} ${pageNo === 1 ? styles.disabled : ""}`}
          onClick={() => handlePageChange(pageNo - 1)}
        >
          Prev
        </li>
        {renderPageNumbers()}
        <li
          className={`${styles.pageList} ${pageNo === totalPages ? styles.disabled : ""}`}
          onClick={() => handlePageChange(pageNo + 1)}
        >
          Next
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
