import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";

import PageHeaderSection from "@/components/PageHeader";
import { fnGenerateMetaData } from "@/utils/utility";
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

const CorporateActionsSubPage = async ({ params }: any) => {
  const type = params.slug;
  if (!validPages.includes(type)) {
    notFound();
  }

  return (
    <>
      <PageHeaderSection
        heading="Corporate Actions"
        description="Stay ahead of market-moving events! Track key corporate actions like Mergers, Buybacks, Dividends, Spinoffs, Reverse Stock Splits, Bonus Issues, and Right Issues with our comprehensive insights."
      />
      <CorporateActionsClient flag={type} />
    </>
  );
};

export default CorporateActionsSubPage;
