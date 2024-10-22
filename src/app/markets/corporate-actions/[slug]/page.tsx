import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";

import PageHeaderSection from "@/components/PageHeader";
import {
  fetchFilters,
  fnGenerateMetaData,
  getAdvanceDeclineData,
  getOverviewData,
  getPeriodicData,
} from "@/utils/utility";
import CorporateActionsClient from "./client";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title: "Corporate Actions",
    desc: "An event carried out by a company that materially impacts its stakeholders.",
    keywords:
      "mergers and acquisitions, stock splits, dividends, bond tenders, bonus, buybacks, rights, spin-offs, corporate action, liquidation, spinoffs",
    pathname: pageUrl,
    index: true,
  };
  return fnGenerateMetaData(meta);
}

const validPages = [
  "dividend",
  "bonus",
  "board-meetings",
  "agm-egm",
  "splits",
  "rights",
];

async function fetchData(indexId: number) {
  return Promise.all([
    getOverviewData(indexId, 1),
    getAdvanceDeclineData(indexId, "daily", 1),
    getPeriodicData(indexId, "1M", 1),
    fetchFilters({}),
  ]);
}

const CorporateActionsSubPage = async ({ params }: any) => {
  const type = params.slug;
  if (!validPages.includes(type)) {
    notFound();
  }

  const niftyFilterData = {
    name: "Nifty 50",
    indexId: 2371,
    seoname: "nifty-50",
    exchange: "nse",
  };
  const [overviewData, advanceDeclineData, periodicData, allFilters] =
    await fetchData(niftyFilterData.indexId);

  return (
    <>
      <PageHeaderSection
        heading="Corporate Actions"
        description="Stay ahead of market-moving events! Track key corporate actions like Mergers, Buybacks, Dividends, Spinoffs, Reverse Stock Splits, Bonus Issues, and Right Issues with our comprehensive insights."
      />
      <CorporateActionsClient
        flag={type}
        advanceDecline={advanceDeclineData}
        selectedFilter={niftyFilterData}
        allFilters={allFilters}
        overview={overviewData}
        periodic={periodicData}
      />
    </>
  );
};

export default CorporateActionsSubPage;
