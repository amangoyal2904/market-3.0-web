"use client";
import styles from "./ViewAll.module.scss";
import { trackingEvent } from "@/utils/ga";
import Image from "next/image";
import Link from "next/link";
import LiveStreamLogo from "../../../public/img/liveStream.svg";
import { customImageLoader } from "@/utils";

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
          <img
            src="https://img.etimg.com/photo/msid-114256957,quality-100/refinitiv.jpg"
            width={88}
            height={22}
            alt="Refinitiv"
            title="Refinitiv"
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
          src={LiveStreamLogo}
          alt={title}
          title="LiveStream"
          loading="lazy"
          quality={100}
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
