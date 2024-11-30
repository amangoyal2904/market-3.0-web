"use client";
import styles from "./IndicesDetails.module.scss";
import { trackingEvent } from "@/utils/ga";

const IndicesQuickLinksClients = ({ item }: any) => {
  return (
    <a
      className={styles.links}
      href={item.url}
      target="_blank"
      title={item.title}
      onClick={() =>
        trackingEvent("et_push_event", {
          event_category: "mercury_engagement",
          event_action: "indices_quicklinks",
          event_label: item.title,
        })
      }
    >
      {item.title}
    </a>
  );
};

export default IndicesQuickLinksClients;
