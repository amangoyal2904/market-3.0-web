import styles from "./styles.module.scss";
import BiggBullInvestorHoldingTable from "./BiggBullTable/InvestorHolding";
import BiggBullBulkBlockDealsTable from "./BiggBullTable/BulkBlockDeals";
import Pagination from "./Pagination";
import NodataForTable from "./NodataForTable";

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
      {pageType === "holdings" && tableData && tableData.length > 0 ? (
        <BiggBullInvestorHoldingTable
          tableHead={tableHead}
          tableData={tableData}
          sortData={sortData}
          handleSort={handleSort}
          shouldShowLoader={shouldShowLoader}
        />
      ) : pageType === "bulk-block-deals" &&
        tableData &&
        tableData.length > 0 ? (
        <BiggBullBulkBlockDealsTable
          tableHead={tableHead}
          tableData={tableData}
          sortData={sortData}
          handleSort={handleSort}
          shouldShowLoader={shouldShowLoader}
        />
      ) : (
        <NodataForTable
          title={`${pageType === "bulk-block-deals" ? "The investor has not made any bulk/ block deals recently" : "No Recommendations Found!"}`}
        />
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
