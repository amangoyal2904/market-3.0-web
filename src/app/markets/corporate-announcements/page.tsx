import { headers } from "next/headers";
import { Metadata } from "next";

import { fnGenerateMetaData, fetchFilters } from "@/utils/utility";
import PageHeaderSection from "@/components/Common/PageHeader";
import CorporateAnnouncementsClient from "./client";
import BreadCrumb from "@/components/BreadCrumb";
import { postRequest } from "@/utils/ajaxUtility";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title: "Corporate Announcements",
    desc: "notifications from a company's board of trustees about a reorganization event that materially impacts shareholders.",
    keywords:
      "acquisition, annaul general meeting, annual report, annual secretarial compliance, assests & Liabilities Statements, Board Meeting, Bonus, Business/Operational Update, Buyback, Call Money/Forfeiture, Capital Reduction, Certificate/Document, Change in Auditer, Change in Company detail, Change in Directorate, Change in key personnel,Clarification sought",
    pathname: pageUrl,
    index: true,
  };
  return fnGenerateMetaData(meta);
}

const CorporateAnnouncementsPage = async () => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const niftyFilterData = {
    name: "All Stocks",
    exchange: "nse",
    seoname: "",
    indexId: 0,
  };
  const allFilters = await fetchFilters({ watchlist: true, all: true });

  /* To Fetch and pass listing data from SSR side */
  const pagesData = {
    totalRecords: 12,
    totalPages: 1,
    pageSize: 12,
    pageNo: 1,
  };

  const filtersData = {
    pagesize: pagesData.pageSize,
    pageno: pagesData.pageNo,
    filterType: "index",
    duration: "3month",
    filterValue: [],
    category: [],
  };
  const announcementsList: any = await postRequest(
    "CORPORATE_ANNOUNCEMENTS",
    filtersData,
  );

  const listingData = announcementsList?.searchresult;

  return (
    <>
      <PageHeaderSection
        heading="Corporate Announcements"
        description="Stay Ahead with Essential Investor Updates: Track timely company news, press releases, and official announcements impacting your investments."
      />
      <CorporateAnnouncementsClient
        selectedFilter={niftyFilterData}
        listingData={listingData}
        pageSummary={pagesData}
        allFilters={allFilters}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Corporate Announcement", redirectUrl: "" }]}
      />
    </>
  );
};

export default CorporateAnnouncementsPage;
