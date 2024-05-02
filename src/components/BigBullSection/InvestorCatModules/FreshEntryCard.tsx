import styles from "./styles.module.scss";
import EntryCard from "./EntryCard";

const FreshEntryCard = ({ cardData }: any) => {
  return (
    <div className={styles.cartWraper}>
      {cardData.map((company: any, index: number) => {
        return <EntryCard key={`${index}-card`} data={company} />;
      })}
    </div>
  );
};

export default FreshEntryCard;
