import styles from "./ViewAll.module.scss";
import ViewMore from "./ViewMore";

const ViewAllLink = (props: any) => {
  const { text, link, alignRight, padding = "" } = props || {};
  return text ? (
    <div
      className={`${styles.seeAll} ${alignRight ? styles.alignRight : styles.alignLeft}`}
      style={{ padding: `${padding}` }}
    >
      <ViewMore text={text} link={link} />
    </div>
  ) : (
    ""
  );
};
export default ViewAllLink;
