import styles from "./IndicesDetails.module.scss";
import IndicesQuickLinksClients from "./IndicesQuickLinksClients";

const quickLinks = [
  {
    title: "Nifty 50",
    url: "https://economictimes.indiatimes.com/markets/indices/nifty-50",
  },
  {
    title: "Nifty Bank",
    url: "https://economictimes.indiatimes.com/markets/indices/nifty-bank",
  },
  {
    title: "Nifty IT",
    url: "https://economictimes.indiatimes.com/markets/indices/nifty-it",
  },
  {
    title: "Sensex",
    url: "https://economictimes.indiatimes.com/markets/indices/bse-sensex",
  },
  {
    title: "BSE Bankex",
    url: "https://economictimes.indiatimes.com/markets/indices/bse-bankex",
  },
  {
    title: "BSE MidCap",
    url: "https://economictimes.indiatimes.com/markets/indices/bse-midcap",
  },
  {
    title: "View All",
    url: "https://economictimes.indiatimes.com/markets/indices",
  },
];

const IndicesQuickLinks = () => {
  return (
    <div className={styles.quickLinkWidget}>
      <h3 className={styles.heading3}>Quick Links</h3>
      <div className={styles.list}>
        {quickLinks.map((item: any, index: number) => (
          <IndicesQuickLinksClients item={item} key={`quicklinks_${index}`} />
        ))}
      </div>
    </div>
  );
};

export default IndicesQuickLinks;
