"use client";
import Link from "next/link";
import styles from "./InvestmentIdea.module.scss";
import { trackingEvent } from "@/utils/ga";
import { replaceWidthHeight } from "@/utils";
import { removeHostname } from "@/utils";

const Card = ({ data, index }: any) => {
  return (
    <Link
      href={removeHostname(data?.url)}
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
        src={replaceWidthHeight(data?.img, 400, 300)}
        alt={`InvestmentData Slide Image`}
        title={data?.title}
        className={styles.cardImage}
        loading="lazy"
        decoding="async"
        width="100%"
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
