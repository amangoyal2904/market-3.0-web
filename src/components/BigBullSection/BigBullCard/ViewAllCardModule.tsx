import styles from "./styles.module.scss";
import Link from "next/link";

const ViewAllCardModule = ({ pageSummaryInfo, lastTitle = "" }: any) => {
  return (
    <>
      <div className={styles.viewAllSec}>
        <Link href="/">
          View All {pageSummaryInfo.totalRecords} {lastTitle}
          <span className={styles.rightArrow}></span>
        </Link>
      </div>
    </>
  );
};

export default ViewAllCardModule;
