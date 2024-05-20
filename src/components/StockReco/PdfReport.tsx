import React from "react";
import styles from "./StockReco.module.scss";
import { trackingEvent } from "@/utils/ga";

export const PdfReport = ({ pdfUrl, companyName }: any) => {
  return (
    <>
      <a
        href={pdfUrl}
        className={styles.viewReportBox}
        target="_blank"
        onClick={() => {
          trackingEvent("et_push_event", {
            event_category: "mercury_engagement",
            event_action: "view_rerport_click",
            event_label: companyName,
          });
        }}
      >
        <span className={`eticon_pdf ${styles.pdfIcon}`}>
          <span className="path1"></span>
          <span className="path2"></span>
          <span className="path3"></span>
          <span className="path4"></span>
        </span>
        View Report
      </a>
      {/* <a
            href={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}${seoName}/stockreports/reportid-${companyID}.cms`}
            target="_blank"
            title="View Report"
        >
            <span className={`eticon_pdf ${styles.pdfIcon}`}>
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
            <span className="path4"></span>
            </span>
            View Report
        </a> */}
    </>
  );
};
