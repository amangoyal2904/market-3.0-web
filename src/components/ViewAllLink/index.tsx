import Link from "next/link";
import styles from "./ViewAll.module.scss";

const ViewAllLink = (props: any) => {
  const { text, link, alignRight, padding = "" } = props || {};
  return text ? (
    <div
      className={`${styles.seeAll} ${alignRight ? styles.alignRight : styles.alignLeft}`}
      style={{ padding: `${padding}` }}
    >
      <Link href={link}>
        {text}
        <span className=" eticon_next" />
      </Link>
    </div>
  ) : (
    ""
  );
};
export default ViewAllLink;
