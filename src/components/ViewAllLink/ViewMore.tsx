"use client";
import Link from "next/link";
import styles from "./ViewAll.module.scss";
import { trackingEvent } from "@/utils/ga";

const ViewMore = ({ text, link }: any) => {
  return (
    <Link
      href={link}
      title={text}
      target="_blank"
      onClick={() =>
        trackingEvent("et_push_event", {
          event_category: "mercury_engagement",
          event_action: "page_cta_click",
          event_label: text,
        })
      }
    >
      {text}
      <span className=" eticon_next" />
    </Link>
  );
};
export default ViewMore;
