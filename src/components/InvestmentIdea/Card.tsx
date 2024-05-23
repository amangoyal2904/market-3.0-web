"use client";
import Link from "next/link";
import styles from "./InvestmentIdea.module.scss";
import { trackingEvent } from "@/utils/ga";

const Card = ({ data, index }: any) => {
  return (
    <Link
      href={data?.url}
      className={`${styles.card}`}
      title={data?.title}
      onClick={() =>
        trackingEvent("et_push_event", {
          event_category: "mercury_engagement",
          event_action: "investment_ideas_clicked",
          event_label: `${index} ${data?.title}`,
        })
      }
    >
      <img
        src={data?.img}
        alt={data?.title}
        title={data?.title}
        className={styles.cardImage}
        loading="lazy"
        decoding="async"
      />
      <h2
        className={styles.cardTitle}
        dangerouslySetInnerHTML={{
          __html: data?.title,
        }}
      />
    </Link>
  );
};

export default Card;
