"use client";
import styles from "./InvestmentIdea.module.scss";
import { ga4withlink } from "@/utils/ga";

const Card = ({ data, index }: any) => {
  return (
    <a
      href="#"
      className={`${styles.card}`}
      title={data?.title}
      onClick={() =>
        ga4withlink(
          "investment_ideas_clicked",
          `${index} ${data?.title}`,
          data?.url,
        )
      }
    >
      <img
        src={data?.img}
        alt={data?.title}
        className={styles.cardImage}
        loading="lazy"
        decoding="async"
      />
      <h2 className={styles.cardTitle}>{data?.title}</h2>
    </a>
  );
};

export default Card;
