import styles from "./styles.module.scss";
import TopTabs from "./TopTabs";
import BiggBullTable from "./BiggBullTable";
import BiggBullQtrChangesTable from "./BiggBullTable/qtrChanges";
import BiggBullRecentTransactionsTable from "./BiggBullTable/RecentTransactions";
import BiggBullBestPicksTable from "./BiggBullTable/BestPicks";
import BiggBullMostHeldTable from "./BiggBullTable/MostHeld";
import Pagination from "./Pagination";
import NodataForTable from "./NodataForTable";
import Blocker from "../Blocker";
import { useStateContext } from "@/store/StateContext";

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
  spanTxt = "",
  pageType = "",
  paginationLastNode = "",
  sortByTimeActive,
  sortByActive,
  sortByActiveHandler,
}: any) => {
  const { state } = useStateContext();
  const { isLogin } = state.login;
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
        spanTxt={spanTxt}
        sortByTimeActive={sortByTimeActive}
        sortByActive={sortByActive}
        sortByActiveHandler={sortByActiveHandler}
        pageType={pageType}
      />
      {tableData && tableData.length > 0 ? (
        <>
          {pageType === "qtrChanges" ? (
            <BiggBullQtrChangesTable
              tableHead={tableHead}
              tableData={tableData}
              sortData={sortData}
              handleSort={handleSort}
              shouldShowLoader={shouldShowLoader}
              sectionName={title}
            />
          ) : pageType === "recentTransactions" ? (
            <BiggBullRecentTransactionsTable
              tableHead={tableHead}
              tableData={tableData}
              sortData={sortData}
              handleSort={handleSort}
              shouldShowLoader={shouldShowLoader}
              sectionName={title}
            />
          ) : pageType === "bestPicks" ? (
            <BiggBullBestPicksTable
              tableHead={tableHead}
              tableData={tableData}
              sortData={sortData}
              handleSort={handleSort}
              shouldShowLoader={shouldShowLoader}
              sectionName={title}
            />
          ) : pageType === "mostHeld" ? (
            <BiggBullMostHeldTable
              tableHead={tableHead}
              tableData={tableData}
              sortData={sortData}
              handleSort={handleSort}
              shouldShowLoader={shouldShowLoader}
              sectionName={title}
            />
          ) : (
            <BiggBullTable
              tableHead={tableHead}
              tableData={tableData}
              sortData={sortData}
              handleSort={handleSort}
              shouldShowLoader={shouldShowLoader}
              sectionName={title}
            />
          )}
        </>
      ) : !!niftyFilter &&
        niftyFilterData?.indexId === "watchlist" &&
        !isLogin ? (
        <Blocker type="watchlitFilterBlocker" />
      ) : (
        <NodataForTable />
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

export default BigBullTableCard;
