import { trackingEvent } from "@/utils/ga";
import styles from "./TopNav.module.scss";
import Link from "next/link";

const tabData = [
  {
    key: "/stocks/chart-patterns",
    label: "New Patterns",
  },
  {
    key: "/stocks/chart-patterns/past-performance",
    label: "Past Performance",
  },
  {
    key: "/stocks/chart-patterns/explore",
    label: "Explore by Patterns",
  },
];

interface TopNavProps {
  pageUrl: string;
}

const TopNav = ({ pageUrl }: TopNavProps) => {
  const isActive = (tabKey: string): boolean => {
    // Match the base path /stocks/chart-patterns/past-performance and any dynamic segments first
    if (
      tabKey === "/stocks/chart-patterns/past-performance" &&
      pageUrl.startsWith("/stocks/chart-patterns/past-performance")
    ) {
      return true;
    }
    // Exact match for /stocks/chart-patterns/explore
    if (tabKey === "/stocks/chart-patterns/explore" && pageUrl === tabKey) {
      return true;
    }
    // Match the base path /stocks/chart-patterns without past-performance or explore
    if (
      tabKey === "/stocks/chart-patterns" &&
      pageUrl.startsWith("/stocks/chart-patterns") &&
      !pageUrl.startsWith("/stocks/chart-patterns/past") &&
      !pageUrl.startsWith("/stocks/chart-patterns/explore")
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className="dflex align-item-center" id={styles.l3Nav}>
      <div className={styles.l3ListWrapper}>
        {tabData.map((item) => (
          <Link
            key={item.key}
            href={item.key}
            className={`${styles.l3List} ${isActive(item.key) ? styles.active : ""}`}
            onClick={() => {
              trackingEvent("et_push_event", {
                event_category: "mercury_engagement",
                event_action: "tab_selected",
                event_label: `ChartPattern_${item.label}`,
              });
            }}
            title={item.label}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopNav;
