import Image from "next/image";
import styles from "./IndicesDetails.module.scss";
export const IndicesNewsCard = ({ data }: any) => {
  return (
    <div className={styles.newsCard}>
      <div className={styles.content}>
        <p className={styles.headline}>{data.hl}</p>
        <span>03 Oct, 2023</span>
      </div>
      <Image
        src={`https://img.etimg.com${data.im}`}
        width={66}
        height={55}
        alt={data.hl}
        loading="lazy"
      />
    </div>
  );
};
