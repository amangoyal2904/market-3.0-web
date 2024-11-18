"use client";
import Link from "next/link";
import { trackingEvent } from "@/utils/ga";

const TrendingInMarketsList = ({ item }: any) => {
  return (
    <>
      <Link
        className="seoLinks"
        href={item.url}
        target="_blank"
        title={item.title}
        onClick={() =>
          trackingEvent("et_push_event", {
            event_category: "mercury_engagement",
            event_action: "trending_in_markets",
            event_label: item.title,
          })
        }
      >
        {item.title}
      </Link>
    </>
  );
};

export default TrendingInMarketsList;
