import styles from "./styles.module.scss";
import Link from "next/link";

const EntryCardViewMore = ({ linkTitle, linkHref }: any) => {
  return (
    <div className={`${styles.card} ${styles.viewMoreSec}`}>
      <Link href={`${linkHref}`}>
        <span className={styles.linkTxt}>{linkTitle}</span>
        <span className={styles.arrow}></span>
      </Link>
    </div>
  );
};

export default EntryCardViewMore;
