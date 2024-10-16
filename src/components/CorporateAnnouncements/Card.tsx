import React from "react";

import styles from "./styles.module.scss";

interface CardItem {
  symbol: string;
  attachmentURL: string;
  caption: string;
  fullText: string;
  companyShortName: string;
  tpilCode: string;
  companyName2: string;
  seoName: string;
  updatedDateTime: string;
  exchangeid: number;
  companyId: number;
  newsid: number;
  datetime: string;
  compid: number;
  scripCode: any;
}

interface CardProps {
  listData: CardItem[];
}

const CardsList: React.FC<CardProps> = ({ listData }) => {
  return (
    <>
      <div>
        {listData?.map((ele) => (
          <div className={styles.card} key={ele?.companyId}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{ele?.symbol}</h3>
              <div className={styles.cardAdd}>+</div>
            </div>
            <div className={styles.cardTag}>{ele?.companyShortName}</div>
            <p className={styles.cardContent}>{ele?.caption}</p>
            <div className={styles.cardFooter}>
              <div className={styles.footerTime}>{ele?.updatedDateTime}</div>
              <a href="#" className={styles.pdfButton}>
                <img src="pdf-icon.png" alt="PDF" className={styles.pdfIcon} />
                <span>View Announcement</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

CardsList.displayName = "CardsList";
export default CardsList;
