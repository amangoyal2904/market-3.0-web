import styles from "./MarketTable.module.scss";
const PaginationTable = ({ pageSummary }: any) => {
  const { totalRecords, totalpages, pagesize, pageno } = pageSummary;

  const pageNumbers = [];
  for (let i = 1; i <= totalpages; i++) {
    pageNumbers.push(i);
  }

  // Calculate range of records being displayed
  const rangeStart = (pageno - 1) * pagesize + 1;
  const rangeEnd = Math.min(pageno * pagesize, totalRecords);

  const onPageChange = (page: number) => {};

  return (
    <>
      <div
        id={styles.tablePagination}
        className={`dflex align-item-center space-between ${styles.m20}`}
      >
        <p>
          Showing {rangeStart}-{rangeEnd} of {totalRecords} stocks
        </p>
        <ul>
          <li className={styles.pageList}>Prev</li>
          {pageNumbers.map((page) => (
            <li
              key={page}
              className={`${styles.pageList} ${page == pageno ? styles.active : null}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </li>
          ))}
          <li className={styles.pageList}>Next</li>
        </ul>
      </div>
    </>
  );
};

export default PaginationTable;
