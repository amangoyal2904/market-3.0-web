import React from "react";
import styles from "./StockReport.module.scss";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils/index";

interface ScoreBoxProps {
  category: string;
  primeUser: boolean;
  tabName?: string;
  seoName: string;
  companyID: string;
  avgScore: any;
}

const ScoreBox: React.FC<ScoreBoxProps> = ({
  category,
  primeUser,
  tabName,
  seoName,
  companyID,
  avgScore,
}) => {
  const renderScoreBox = () => {
    const score = (
      <p className={styles.score}>
        <span>{parseInt(avgScore).toFixed(0)}</span>
        <span className={styles.slash}>/</span>10
      </p>
    );

    const helpText = <p className={styles.helptxt}>Stock Score</p>;

    const reportCTA = (
      <div className={styles.reportCta}>
        <span className={`eticon_pdf ${styles.pdfIcon}`}>
          <span className="path1"></span>
          <span className="path2"></span>
          <span className="path3"></span>
          <span className="path4"></span>
        </span>
        View Report
      </div>
    );

    if (primeUser) {
      return (
        <a
          href={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}${seoName}/stockreports/reportid-${companyID}.cms`}
          className={styles.scoreBox}
          target="_blank"
          title="Stock Score"
          data-ga-onclick={`SR+ ${tabName}#${category} - ${name} View Report#href`}
        >
          {score}
          {helpText}
          {reportCTA}
        </a>
      );
    } else {
      return (
        <div className={styles.scoreBox}>
          {score}
          {helpText}
          {reportCTA}
        </div>
      );
    }
  };

  return <>{renderScoreBox()}</>;
};

export default ScoreBox;
