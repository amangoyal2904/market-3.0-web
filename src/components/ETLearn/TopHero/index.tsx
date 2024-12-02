import styles from "./styles.module.scss";
import Link from "next/link";
import { trackingEvent } from "@/utils/ga";

const TopHero = ({ head, desc, link, headTag = "" }: any) => {
  const gaTrackingClickHandler = () => {
    trackingEvent("et_push_event", {
      et_product: "Mercury_ETLearn",
      event_action: "ClickBack",
      event_category: "mercury_engagement",
      event_label: `${head}`,
      feature_name: "ETLearn",
      page_template: "etlearn",
      product_name: "Mercury_Earnings",
    });
  };
  return (
    <>
      {headTag === "h1" && <h1 className={styles.title}> {head} </h1>}
      {headTag === "h2" && <h2 className={styles.title}> {head} </h2>}
      <p className={styles.desc}>{desc}</p>
    </>
  );
};

export default TopHero;
