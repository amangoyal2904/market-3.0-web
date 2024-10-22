import { headers } from "next/headers";
import { Metadata } from "next";

import {
  fetchFilters,
  fnGenerateMetaData,
  getAdvanceDeclineData,
  getOverviewData,
  getPeriodicData,
} from "@/utils/utility";
import CorporateAnnouncementsClient from "./client";
import PageHeaderSection from "@/components/PageHeader";

async function fetchData(indexId: number) {
  return Promise.all([
    getOverviewData(indexId, 1),
    getAdvanceDeclineData(indexId, "daily", 1),
    getPeriodicData(indexId, "1M", 1),
    fetchFilters({}),
  ]);
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
    name: "Nifty 50",
    indexId: 2369,
    seoname: "nifty-50",
    exchange: "nse",
  };
  const [overviewData, advanceDeclineData, periodicData, allFilters] =
    await fetchData(niftyFilterData.indexId);

  return (
    <>
      <PageHeaderSection
        heading="Corporate Announcements"
        description="Stay Ahead with Essential Investor Updates: Track timely company news, press releases, and official announcements impacting your investments."
      />
      <CorporateAnnouncementsClient
        advanceDecline={advanceDeclineData}
        selectedFilter={niftyFilterData}
        allFilters={allFilters}
        overview={overviewData}
        periodic={periodicData}
      />
    </>
  );
};

export default CorporateAnnouncementsPage;
