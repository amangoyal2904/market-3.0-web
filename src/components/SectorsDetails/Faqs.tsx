import React, { useState } from "react";
import styles from "./SectorsDetails.module.scss";
import { trackingEvent } from "@/utils/ga";
import { encodeHTML } from "@/utils/utility";

const SectorsFaqs = React.memo(({ faqs }: any) => {
  const faqMainEntity: any[] = [];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqMainEntity,
  };

  const [activeItems, setActiveItems] = useState<number[]>([0]);

  const handleItemClick = (faq: any, index: number) => {
    // If the clicked item is already active, remove it from activeItems
    if (activeItems.includes(index)) {
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "faq_collapsed",
        event_label: faq?.q,
      });
      setActiveItems(activeItems.filter((item) => item !== index));
    } else {
      // Otherwise, add it to activeItems
      trackingEvent("et_push_event", {
        event_category: "mercury_engagement",
        event_action: "faq_expand",
        event_label: faq?.q,
      });
      setActiveItems([...activeItems, index]);
    }
  };
  return (
    <>
      <h2 className={styles.heading}>Frequently Asked Questions</h2>
      <div className={styles.wrapper}>
        <ul id={styles.faq}>
          {faqs.map((faq: any, index: number) => {
            faqMainEntity.push({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: encodeHTML(faq.a),
              },
            });
            return (
              <li
                key={index}
                className={`${styles.faq} ${activeItems.includes(index) ? styles.active : ""}`}
                onClick={() => handleItemClick(faq, index)}
              >
                <div className={styles.heading}>
                  {faq.q}
                  <span className={styles.navigate}>
                    <i className="eticon_caret_down"></i>
                  </span>
                </div>
                <div
                  className={styles.desc}
                  dangerouslySetInnerHTML={{ __html: faq.a }}
                ></div>
              </li>
            );
          })}
        </ul>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </>
  );
});

SectorsFaqs.displayName = "SectorsFaqs";
export default SectorsFaqs;
