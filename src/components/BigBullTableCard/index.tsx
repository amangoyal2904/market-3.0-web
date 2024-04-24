import styles from "./styles.module.scss";
import TopTabs from "./TopTabs";
import BiggBullTable from "./BiggBullTable";
import BiggBullQtrChangesTable from "./BiggBullTable/qtrChanges";
import Pagination from "./Pagination";

const BigBullTableCard = ({
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
}: any) => {
  return (
    <>
      <TopTabs
        niftyFilterData={niftyFilterData}
        filterDataChange={filterDataChange}
        niftyFilter={niftyFilter}
        searchInvestor={searchInvestor}
        invstrQuery={invstrQuery}
        invstrQueryHandler={invstrQueryHandler}
        title={title}
      />
      {pageType === "qtrChanges" ? (
        <BiggBullQtrChangesTable
          tableHead={tableHead}
          tableData={tableData}
          sortData={sortData}
          handleSort={handleSort}
          shouldShowLoader={shouldShowLoader}
        />
      ) : (
        <BiggBullTable
          tableHead={tableHead}
          tableData={tableData}
          sortData={sortData}
          handleSort={handleSort}
          shouldShowLoader={shouldShowLoader}
        />
      )}

      {tableData?.length === 0 ? (
        <div className="prel">NO data Found</div>
      ) : (
        pagination &&
        pagination.totalPages > 1 && (
          <Pagination
            pageSummary={pagination}
            onPageChange={handlePageChange}
          />
        )
      )}
    </>
  );
};

export default BigBullTableCard;
