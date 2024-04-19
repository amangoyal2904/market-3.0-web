import styles from "./styles.module.scss";
import TopTabs from "./TopTabs";
import BiggBullTable from "./BiggBullTable";

const BigBullTableCard = ({
  niftyFilterData,
  filterDataChange,
  tableHead,
  tableData,
}: any) => {
  return (
    <>
      <TopTabs
        niftyFilterData={niftyFilterData}
        filterDataChange={filterDataChange}
      />
      <BiggBullTable tableHead={tableHead} tableData={tableData} />
    </>
  );
};

export default BigBullTableCard;
