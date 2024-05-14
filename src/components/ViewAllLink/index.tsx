import Link from "next/link";
import styles from "./ViewAll.module.scss";
import ViewMore from "./ViewMore";

const ViewAllLink = (props: any) => {
  const { text, link, alignRight, padding = "" } = props || {};
  return text ? (
    <div
      className={`${styles.seeAll} ${alignRight ? styles.alignRight : styles.alignLeft}`}
      style={{ padding: `${padding}` }}
    >
      {/* <a href={link} title={text} target="_blank" onClick={()=>}>
        {text}
        <span className=" eticon_next" />
      </a> */}
      <ViewMore text={text} link={link} />
    </div>
  ) : (
    ""
  );
};
export default ViewAllLink;
