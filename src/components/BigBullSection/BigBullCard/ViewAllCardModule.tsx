import styles from "./styles.module.scss";
import Link from "next/link";

const ViewAllCardModule = () => {
  return (
    <>
      <div className={styles.viewAllSec}>
        <Link href="/">
          View All 69 Investors
          <span className={styles.rightArrow}></span>
        </Link>
      </div>
    </>
  );
};

export default ViewAllCardModule;
