"use client";
import Link from "next/link";
import styles from "./ViewAll.module.scss";
import { trackingEvent } from "@/utils/ga";

const ViewMore = ({ text, link }: any) => {
  const handleClick = (link: string, text: string) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "page_cta_click",
      event_label: text,
    });
    window.open(link, "_blank");
  };
  return (
    <a href="#" title={text} onClick={() => handleClick(link, text)}>
      {text}
      <span className=" eticon_next" />
    </a>
  );
};
export default ViewMore;
