import { headers } from "next/headers";
import { Metadata } from "next";

import { fnGenerateMetaData, fetchFilters } from "@/utils/utility";
import PageHeaderSection from "@/components/PageHeader";
import CorporateAnnouncementsClient from "./client";

async function fetchData(indexId: number) {
  return Promise.all([fetchFilters({ watchlist: true, all: true })]);
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title: "InvestEdge",
    desc: "notifications from a company's board of trustees about a reorganization event that materially impacts shareholders.",
    keywords:
      "acquisition, annaul general meeting, annual report, annual secretarial compliance, assests & Liabilities Statements, Board Meeting, Bonus, Business/Operational Update, Buyback, Call Money/Forfeiture, Capital Reduction, Certificate/Document, Change in Auditer, Change in Company detail, Change in Directorate, Change in key personnel,Clarification sought",
    pathname: pageUrl,
    index: true,
  };
  return fnGenerateMetaData(meta);
}

const CorporateAnnouncementsPage = async () => {
  const niftyFilterData = {
    seoname: "nifty-50",
    name: "Nifty 50",
    exchange: "nse",
    indexId: 2369,
  };
  const [allFilters] = await fetchData(niftyFilterData.indexId);

  return (
    <>
      <PageHeaderSection
        heading="Corporate Announcements"
        description="Stay Ahead with Essential Investor Updates: Track timely company news, press releases, and official announcements impacting your investments."
      />
      <CorporateAnnouncementsClient
        selectedFilter={niftyFilterData}
        allFilters={allFilters}
      />
    </>
  );
};

export default CorporateAnnouncementsPage;
