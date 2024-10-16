import React from "react";

import styles from "./styles.module.scss";

const CardsList = () => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>WHITHAL</h3>
        <div className={styles.cardAdd}>+</div>
      </div>
      <div className={styles.cardTag}>Newspaper Publication</div>
      <p className={styles.cardContent}>
        Informed the Exchange regarding Monitoring Agency Report
      </p>
      <div className={styles.cardFooter}>
        <div className={styles.footerTime}>Aug 13, 12:47 PM</div>
        <a href="#" className={styles.pdfButton}>
          <img src="pdf-icon.png" alt="PDF" className={styles.pdfIcon} />
          <span>View Announcement</span>
        </a>
      </div>
    </div>
  );
};

CardsList.displayName = "CardsList";
export default CardsList;
