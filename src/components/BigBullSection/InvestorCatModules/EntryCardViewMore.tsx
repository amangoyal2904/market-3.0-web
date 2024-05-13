import styles from "./styles.module.scss";
import Link from "next/link";

const EntryCardViewMore = ({ linkTitle, linkHref, cartType }: any) => {
  return (
    <div
      className={`${styles.card} ${styles.viewMoreSec} ${cartType !== "" ? styles[cartType] : ""}`}
    >
      <Link href={`${linkHref}`}>
        <span className={styles.linkTxt}>{linkTitle}</span>
        <span className={styles.arrow}></span>
      </Link>
    </div>
  );
};

export default EntryCardViewMore;
