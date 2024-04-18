import styles from "./IndicesDetails.module.scss";
import Link from "next/link";
export const IndicesNewsCard = ({ data }: any) => {
  const updateURLDimensions = (url: string) => {
    const regex = /width=\d+&height=\d+/;
    const replacement = `width=66&height=55`;
    const newUrl = url.replace(regex, replacement);
    return "https://img.etimg.com" + newUrl;
  };
  return (
    <Link className={styles.newsCard} href={data.wu} target="_blank">
      <div className={styles.content}>
        <p className={styles.headline}>{data.hl}</p>
        <span>03 Oct, 2023</span>
      </div>
      <img
        src={updateURLDimensions(data.im)}
        width={66}
        height={55}
        alt={data.hl}
        loading="lazy"
      />
    </Link>
  );
};
