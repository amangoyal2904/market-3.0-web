import styles from "./styles.module.scss";
import Link from "next/link";

const ViewAllCta = ({
  text,
  url,
  self = "_blank",
  urlInternal = "no",
}: any) => {
  return (
    <>
      <div className={styles.viewAllCta}>
        {urlInternal === "yes" ? (
          <Link href={`${url}`}>{text}</Link>
        ) : (
          <a href={`${url}`} target={`${self}`}>
            {text}
          </a>
        )}
      </div>
    </>
  );
};

export default ViewAllCta;
