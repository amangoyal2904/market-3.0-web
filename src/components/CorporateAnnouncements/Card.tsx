import Image from "next/image";
import React from "react";

import ETPagination from "@/components/Common/Pagination/Pagination";
import WatchlistAddition from "../WatchlistAddition";
import { getStockUrl } from "@/utils/utility";
import { trackingEvent } from "@/utils/ga";
import styles from "./styles.module.scss";
import { dateFormat } from "@/utils";
import Link from "next/link";

interface CardItem {
  symbol: string;
  attachmentURL: string;
  caption: string;
  fullText: string;
  fullTextData: string;
  companyType: string;
  companyShortName: string;
  category: [];
  tpilCode: string;
  companyName2: string;
  companyName: string;
  seoName: string;
  updatedDateTime: string;
  exchangeid: number;
  companyId: number;
  newsid: number;
  datetime: string;
  compid: any;
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
                  href={getStockUrl(ele?.compid, ele?.seoName)}
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
              </div>
              {(ele?.symbol || ele?.companyType) && (
                <div className={styles.cardTag}>
                  {ele?.category.map((ele) => <span key={ele}>{ele}</span>)}
                </div>
              )}
              <p title={ele?.fullTextData} className={styles.cardContent}>
                {ele?.fullTextData}
              </p>
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
                  <Image
                    src="https://img.etimg.com/photo/msid-114415005/view-announcements.jpg"
                    alt="PDF"
                    title="PDF"
                    unoptimized
                    width={138}
                    height={30}
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
