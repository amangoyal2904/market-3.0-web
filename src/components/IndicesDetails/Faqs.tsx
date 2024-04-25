import React, { useState } from "react";
import styles from "./IndicesDetails.module.scss";

const IndicesFaqs = React.memo(({ faqs }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
  };
  return (
    <>
      <h2 className={styles.heading}>Frequently Asked Questions</h2>
      <div className={styles.wrapper}>
        <ul id={styles.faq}>
          {faqs.map((faq: any, index: number) => (
            <li
              key={index}
              className={`${styles.faq} ${index === activeIndex ? styles.active : ""}`}
              onClick={() => handleItemClick(index)}
            >
              <div className={styles.heading}>
                {faq.q}{" "}
                <span className={styles.navigate}>
                  <i className="eticon_caret_down"></i>
                </span>
              </div>
              <div
                className={styles.desc}
                dangerouslySetInnerHTML={{ __html: faq.a }}
              ></div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
});
IndicesFaqs.displayName = "IndicesFaqs";
export default IndicesFaqs;
