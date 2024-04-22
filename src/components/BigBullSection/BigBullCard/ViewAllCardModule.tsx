import styles from "./styles.module.scss";
import Link from "next/link";

const ViewAllCardModule = ({ cartTitle = "", cartLink = "" }: any) => {
  return (
    <>
      <div className={styles.viewAllSec}>
        <Link href={`${cartLink}`}>
          {cartTitle}
          <span className={styles.rightArrow}></span>
        </Link>
      </div>
    </>
  );
};

export default ViewAllCardModule;
