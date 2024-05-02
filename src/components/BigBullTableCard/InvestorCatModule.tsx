import styles from "./styles.module.scss";
import BiggBullInvestorHoldingTable from "./BiggBullTable/InvestorHolding";
import BiggBullBulkBlockDealsTable from "./BiggBullTable/BulkBlockDeals";
import Pagination from "./Pagination";

const InvestorCatModule = ({
  niftyFilterData,
  filterDataChange,
  tableHead,
  tableData,
  niftyFilter = false,
  searchInvestor = false,
  invstrQuery = "",
  invstrQueryHandler,
  sortData,
  handleSort,
  pagination,
  handlePageChange,
  shouldShowLoader,
  title = "",
  pageType = "",
  paginationLastNode = "",
}: any) => {
  return (
    <>
      {pageType === "holdings" ? (
        <BiggBullInvestorHoldingTable
          tableHead={tableHead}
          tableData={tableData}
          sortData={sortData}
          handleSort={handleSort}
          shouldShowLoader={shouldShowLoader}
        />
      ) : pageType === "bulk-block-deals" ? (
        <BiggBullBulkBlockDealsTable
          tableHead={tableHead}
          tableData={tableData}
          sortData={sortData}
          handleSort={handleSort}
          shouldShowLoader={shouldShowLoader}
        />
      ) : (
        "no data found"
      )}

      {tableData?.length === 0 ? (
        <div className="prel"></div>
      ) : (
        pagination &&
        pagination.totalPages > 1 && (
          <Pagination
            pageSummary={pagination}
            onPageChange={handlePageChange}
            paginationLastNode={paginationLastNode}
          />
        )
      )}
    </>
  );
};

export default InvestorCatModule;
