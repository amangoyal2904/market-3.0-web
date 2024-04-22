import styles from "./styles.module.scss";
import TopTabs from "./TopTabs";
import BiggBullTable from "./BiggBullTable";

const BigBullTableCard = ({
  niftyFilterData,
  filterDataChange,
  tableHead,
  tableData,
  niftyFilter = false,
  searchInvestor = false,
  invstrQuery = "",
  invstrQueryHandler,
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
      />
      <BiggBullTable tableHead={tableHead} tableData={tableData} />
    </>
  );
};

export default BigBullTableCard;
