import styles from "./styles.module.scss";
import BigBullCard from "./BigBullCard";
import ViewAllCardModule from "./BigBullCard/ViewAllCardModule";

const BigBullSection = ({ data, title = "", type = "", mode = "" }: any) => {
  return (
    <>
      <div className={styles.mainCardSec}>
        <h3 className={styles.head3}>{title}</h3>
        <div className={styles.cartHolder}>
          <BigBullCard type={type} mode={mode} />
          <BigBullCard type={type} mode={mode} />
          <BigBullCard type={type} mode={mode} />
          <ViewAllCardModule />
        </div>
      </div>
    </>
  );
};

export default BigBullSection;
