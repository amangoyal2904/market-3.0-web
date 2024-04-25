import React, { useState } from "react";
import styles from "./IndicesDetails.module.scss";

const faqs = [
  {
    question: "What's the market capitalization of Nifty 50?",
    answer:
      "Within the Cement sector, Nifty 50 stock has a market cap rank of @@MCAPRANK@@. Nifty 50 has a market cap of Rs @@MARKETCAP@@ Cr.\n",
  },
  {
    question: "Which are the key peers to Nifty 50?",
    answer:
      "Within Cement sector Nifty 50, Heidelberg Cement India Ltd., Ambuja Cements Ltd. and UltraTech Cement Ltd. are usually compared together by investors for analysis.",
  },
  {
    question: "What is the recommendation for Nifty 50 - Buy or Sell?",
    answer:
      "As per Refinitiv (erstwhile Thomson Reuters), overall mean recommendation by 31 analysts for Nifty 50 stock is to Buy. Recommendation breakup is as follows\n\n<ul>\n <li> 11 analysts are recommending Strong Buy</li> <li> 8 analysts are recommending to Buy</li> <li> 6 analysts are recommending to Hold</li> <li> 6 analysts are recommending to Sell</li> </ul>",
  },
];

const IndicesFaqs = React.memo(() => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
  };
  return (
    <>
      <h2 className={styles.heading}>Frequently Asked Questions</h2>
      <div className={styles.wrapper}>
        <ul id={styles.faq}>
          {faqs.map((faq, index) => (
            <li
              key={index}
              className={`${styles.faq} ${index === activeIndex ? styles.active : ""}`}
              onClick={() => handleItemClick(index)}
            >
              <div className={styles.heading}>
                {faq.question}{" "}
                <span className={styles.navigate}>
                  <i className="eticon_caret_down"></i>
                </span>
              </div>
              <div
                className={styles.desc}
                dangerouslySetInnerHTML={{ __html: faq.answer }}
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
