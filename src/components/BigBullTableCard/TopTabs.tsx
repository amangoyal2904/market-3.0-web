import styles from "./styles.module.scss";

const TopTabs = () => {
  return (
    <div className={styles.topTabs}>
      <h2 className={styles.head3}>Individual Investors Tabs Heading</h2>
      <ul className={styles.rightFilterSec}>
        <li className={styles.sortFitler}>
          <div className={styles.sortTxt}>
            Sort by: <span>NetWorth</span>
          </div>
        </li>
        <li className={styles.switchFitler}>
          <div className={styles.switchSec}>
            <div className={styles.cardIcon}></div>
            <div className={styles.tableIcon}></div>
          </div>
        </li>
        <li className={styles.niftyFilter}>
          <div className={styles.niftySec}>Nifty 50</div>
        </li>
      </ul>
    </div>
  );
};

export default TopTabs;
