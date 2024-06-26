import Link from "next/link";
import styles from "./IndicesDetails.module.scss";
import { trackingEvent } from "@/utils/ga";

const quickLinks = [
  {
    title: "Nifty 50",
    url: "/markets/indices/nifty-50",
  },
  {
    title: "Nifty Bank",
    url: "/markets/indices/nifty-bank",
  },
  {
    title: "Nifty IT",
    url: "/markets/indices/nifty-it",
  },
  {
    title: "Sensex",
    url: "/markets/indices/bse-sensex",
  },
  {
    title: "BSE Bankex",
    url: "/markets/indices/bse-bankex",
  },
  {
    title: "BSE MidCap",
    url: "/markets/indices/bse-midcap",
  },
  {
    title: "View All",
    url: "/markets/indices",
  },
];

const IndicesQuickLinks = () => {
  return (
    <div className={styles.quickLinkWidget}>
      <h4 className={styles.headline}>Quicklinks:</h4>
      <div className={styles.list}>
        {quickLinks.map((item: any, index: number) => (
          <Link
            key={`indices_${index}`}
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
          </Link>
        ))}
      </div>
    </div>
  );
};

export default IndicesQuickLinks;
