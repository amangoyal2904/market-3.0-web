"use client";
import styles from "./ViewAll.module.scss";
import { trackingEvent } from "@/utils/ga";
import Image from "next/image";
import Link from "next/link";

const HeadingHome = ({ title, url }: any) => {
  return title == "Stock Reports Plus" ? (
    <h2 className="heading">
      <div className="dflex align-item-center space-between">
        <a
          target="_blank"
          title={title}
          href={url}
          onClick={() =>
            trackingEvent("et_push_event", {
              event_category: "mercury_engagement",
              event_action: "widget_heading",
              event_label: title,
            })
          }
        >
          {title}
          <span className={`eticon_caret_right headingIcon`} />
        </a>
        <p className={styles.powered}>
          Powered By
          <Image
            src="/marketsweb/img/refinitiv.png"
            width={88}
            height={22}
            alt="Refinitiv"
            loading="lazy"
          />
        </p>
      </div>
    </h2>
  ) : title == "Live Stream" ? (
    <h2 className={`heading ${styles.liveStreamhead}`}>
      <Link
        target="_blank"
        title={title}
        href={url}
        onClick={() =>
          trackingEvent("et_push_event", {
            event_category: "mercury_engagement",
            event_action: "widget_heading",
            event_label: title,
          })
        }
      >
        <Image
          src="/marketsweb/img/liveStream.svg"
          width={170}
          height={26}
          alt={title}
          loading="lazy"
        />
        <span className={`eticon_caret_right ${styles.headingIcon}`} />
      </Link>
    </h2>
  ) : (
    <h2 className={styles.title}>
      <Link
        title={title}
        target="_blank"
        href={url}
        onClick={() =>
          trackingEvent("et_push_event", {
            event_category: "mercury_engagement",
            event_action: "widget_heading",
            event_label: title,
          })
        }
      >
        {title}
        <span className={`eticon_caret_right ${styles.headingIcon}`} />
      </Link>
    </h2>
  );
};
export default HeadingHome;
