import styles from "./styles.module.scss";
import EntryCard from "./EntryCard";
import EntryCardViewMore from "./EntryCardViewMore";
import NodataForTable from "../../BigBullTableCard/NodataForTable";

const FreshEntryCard = ({ cardData, linkTitle = "", linkHref = "" }: any) => {
  return (
    <>
      {cardData && cardData.length > 0 ? (
        <div className={styles.cartWraper}>
          {cardData.map((company: any, index: number) => {
            return <EntryCard key={`${index}-card`} data={company} />;
          })}{" "}
          {linkTitle !== "" && linkHref !== "" && (
            <EntryCardViewMore linkTitle={linkTitle} linkHref={linkHref} />
          )}{" "}
        </div>
      ) : (
        <div className={styles.noDataSec}>
          <NodataForTable />
        </div>
      )}
    </>
  );
};

export default FreshEntryCard;
