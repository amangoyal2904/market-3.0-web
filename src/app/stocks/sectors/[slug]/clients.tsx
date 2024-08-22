"use client";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import SectorsDetailsOverview from "@/components/SectorsDetails/Overview";
import useDebounce from "@/hooks/useDebounce";
import styles from "./SectorsDetails.module.scss";
import KeyMetricsSectors from "@/components/SectorsDetails/KeyMetrics";
import SectorsConstituents from "@/components/SectorsDetails/Constituents";
import { trackingEvent } from "@/utils/ga";
import SectorsPerformance from "@/components/SectorsDetails/Performance";

const pageTabData = [
  { label: "Key Metrics", key: "keymetrics" },
  { label: "Performance", key: "performance" },
  { label: "Constituents", key: "constituents" },
  { label: "FAQs", key: "faqs" },
];

const DEBOUNCE_DELAY = 10;

const SectorsDetailsClient = ({
  overview = {},
  peers = {},
  others = {},
  faq = {},
  tabData = [],
  activeViewId = null,
  tableHeaderData = [],
  tableData = [],
  pageSummary = {},
  tableConfig = {},
  tabConfig = {},
  payload = {},
  sectorsListData = {},
}: any) => {
  const [activeItem, setActiveItem] = useState<string>("keymetrics");
  const [overviewData, setOverviewData] = useState(overview);
  const contentRefs = useRef<HTMLDivElement>(null);
  const [scrollByItemClick, setScrollByItemClick] = useState(false); // New state to track scroll triggered by item click
  const { debounce } = useDebounce();
  const assetId = overview.assetId;
  const assetName = overview.assetName;
  const { indexDescription, indexFaq = [] } = faq;

  const handleScroll = debounce(() => {
    if (!scrollByItemClick) {
      // Only execute when scrolling is not triggered by item click
      const contentRefs = document.querySelectorAll(".sections");
      const windowHeight = window.innerHeight;

      contentRefs.forEach((ref) => {
        const section = ref as HTMLElement;
        const sectionRect = section.getBoundingClientRect();
        const tolerance = windowHeight * 0.2;

        if (sectionRect.top <= tolerance && sectionRect.bottom >= tolerance) {
          setActiveItem(section.id);
        }
      });
    }
  }, DEBOUNCE_DELAY);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [debounce]);

  const scrollToActiveContent = useCallback((itemId: string) => {
    const element = document.getElementById(itemId);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const offset = elementRect.top + window.pageYOffset - 120; // Adjust offset as needed
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, []);

  const handleItemClick = useCallback(
    (item: string) => {
      setScrollByItemClick(true); // Set flag to indicate scrolling triggered by item click
      window.removeEventListener("scroll", handleScroll); // Remove scroll event listener
      setActiveItem(item);
      scrollToActiveContent(item); // Scroll to the clicked tab's section

      setTimeout(() => {
        window.addEventListener("scroll", handleScroll); // Add scroll event listener after a small delay
        setScrollByItemClick(false); // Reset flag after scrolling is done
      }, 1000);
    },
    [scrollToActiveContent, handleScroll],
  );

  return (
    <>
      <SectorsDetailsOverview
        overviewData={overviewData}
        descText={indexDescription}
      />
      <div className={styles.tabsWrap}>
        <ul className={styles.tabsList}>
          {pageTabData.map((item: any) => (
            <Fragment key={item.key}>
              {!!(
                item.key !== "faqs" ||
                (item.key === "faqs" && !!indexFaq.length)
              ) && (
                <li
                  onClick={() => {
                    trackingEvent("et_push_event", {
                      event_category: "mercury_engagement",
                      event_action: "indices_section click",
                      event_label: item.label,
                    });
                    handleItemClick(item.key);
                  }}
                  className={activeItem === item.key ? styles.active : ""}
                >
                  {item.label}
                </li>
              )}
            </Fragment>
          ))}
        </ul>
      </div>
      <div className={styles.wrapper}>
        {pageTabData.map((item: any) => (
          <Fragment key={item.key}>
            {!!(
              item.key !== "faqs" ||
              (item.key === "faqs" && !!indexFaq.length)
            ) && (
              <div
                id={item.key}
                className={`${styles.section} sections`}
                ref={contentRefs}
              >
                {item.key === "keymetrics" && (
                  <KeyMetricsSectors data={overviewData} />
                )}
                {item.key === "performance" && (
                  <SectorsPerformance
                    data={peers}
                    indexName={assetName}
                    sectorsListData={sectorsListData}
                  />
                )}

                {item.key === "constituents" && (
                  <SectorsConstituents
                    indexName={assetName}
                    otherSectors={others}
                    tabData={tabData}
                    activeViewId={activeViewId}
                    tableHeaderData={tableHeaderData}
                    tableData={tableData}
                    pageSummary={pageSummary}
                    tableConfig={tableConfig}
                    tabConfig={tabConfig}
                    payload={payload}
                  />
                )}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </>
  );
};

export default SectorsDetailsClient;
