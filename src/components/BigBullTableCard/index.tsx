import styles from "./styles.module.scss";
import TopTabs from "./TopTabs";
import BiggBullTable from "./BiggBullTable";

const BigBullTableCard = ({ niftyFilterData, filterDataChange }: any) => {
  return (
    <>
      <TopTabs
        niftyFilterData={niftyFilterData}
        filterDataChange={filterDataChange}
      />
      <BiggBullTable />
    </>
  );
};

export default BigBullTableCard;
