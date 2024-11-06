import React from "react";

import ETPagination from "@/components/Pagination/Pagination";
import WatchlistAddition from "../WatchlistAddition";
import { trackingEvent } from "@/utils/ga";
import styles from "./styles.module.scss";
import { dateFormat } from "@/utils";
import Link from "next/link";

interface CardItem {
  symbol: string;
  attachmentURL: string;
  caption: string;
  fullText: string;
  companyType: string;
  companyShortName: string;
  tpilCode: string;
  companyName2: string;
  companyName: string;
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
  pageSummary: any;
  onPageChange: Function;
}

const CardsList: React.FC<CardProps> = ({
  listData,
  pageSummary,
  onPageChange,
}) => {
  const companyPage = (companyName: string) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "click",
      event_label: companyName,
    });
  };

  const viewAnnounncement = (compID: any) => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "click",
      event_label: `view announcement_${compID}`,
    });
  };

  return (
    <>
      <div className={styles.cardsOuterContainer}>
        <div className={styles.cardsContainer}>
          {listData?.map((ele) => (
            <div className={styles.card} key={ele?.compid}>
              <div className={styles.cardHeader}>
                <Link
                  className={styles.cardTitle}
                  onClick={() =>
                    companyPage(
                      ele?.companyName ||
                        ele?.companyShortName ||
                        ele?.companyName2,
                    )
                  }
                  title={ele?.companyName}
                  target="_blank"
                  href={`/${ele?.companyName?.replaceAll(" ", "-").toLowerCase()}/stocks/companyid-${ele?.compid}.cms`}
                >
                  {ele?.companyName ||
                    ele?.companyShortName ||
                    ele?.companyName2}
                </Link>
                <WatchlistAddition
                  companyName={ele?.companyName}
                  companyId={ele?.compid}
                  companyType={ele?.companyType}
                  customStyle={{
                    width: "18px",
                    height: "18px",
                  }}
                />
                {/* <div className={styles.cardAdd}>+</div> */}
              </div>
              {(ele?.symbol || ele?.companyType) && (
                <div className={styles.cardTag}>
                  {ele?.symbol || ele?.companyType}
                </div>
              )}
              <p className={styles.cardContent}>{ele?.caption}</p>
              <div className={styles.cardFooter}>
                <div className={styles.footerTime}>
                  {dateFormat(ele?.updatedDateTime, "%MMM %d, %H:%m %p")}
                </div>
                <a
                  onClick={() => viewAnnounncement(ele?.compid)}
                  target="_blank"
                  href={ele?.attachmentURL}
                  className={styles.pdfButton}
                >
                  <img
                    src="https://img.etimg.com/photo/msid-114415005/view-announcements.jpg"
                    alt="PDF"
                    className={styles.pdfIcon}
                  />
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.paginationBox}>
          {pageSummary?.totalPages > 1 && (
            <ETPagination
              pageSummary={pageSummary}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

CardsList.displayName = "CardsList";
export default CardsList;
