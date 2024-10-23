import { useState } from "react";
import styles from "./styles.module.scss";

const FAQSector = ({ data }: any) => {
  const [faqActive, setFaqActive] = useState(0);
  const faqHander = (value: any) => {
    setFaqActive(value === faqActive ? -1 : value);
  };
  return (
    <>
      <div className={styles.faqWrap}>
        <div className={styles.topHead}>Frequently Asked Questions</div>
        <div className={styles.faqSec}>
          <ul>
            {data && data.length > 0
              ? data.map((item: any, index: number) => {
                  return (
                    <li
                      className={`${styles.liList} ${index === faqActive ? styles.active : ""}`}
                      key={`--${index}-${item?.q}`}
                    >
                      <h5
                        className={styles.question}
                        onClick={() => faqHander(index)}
                      >
                        {item?.q}
                        <span className={`${styles.arrow}`}></span>
                      </h5>
                      <div
                        className={styles.answer}
                        dangerouslySetInnerHTML={{
                          __html: item?.a,
                        }}
                      />
                    </li>
                  );
                })
              : ""}
          </ul>
        </div>
      </div>
    </>
  );
};

export default FAQSector;
