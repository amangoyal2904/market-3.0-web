import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";

import { fnGenerateMetaData } from "@/utils/utility";
import CorporateAnnouncementsClient from "./client";
import PageHeaderSection from "@/components/PageHeader";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title: "Corporate Actions",
    desc: "Corporate Actions",
    keywords: "Corporate Actions, Stocks Market",
    pathname: pageUrl,
    index: true,
  };
  return fnGenerateMetaData(meta);
}

const CorporateAnnouncementsPage = async () => {
  // const responseGetter = typeToFunctionMap[type];
  // const response: any = await responseGetter();

  /* const summaryParam = typeToSummaryParamMap[type];
  const summaryResponse: any = await getFiiDiiSummaryData(summaryParam);
  const summaryData = summaryResponse; */

  return (
    <>
      <PageHeaderSection
        heading="Corporate Announcements"
        description="Stay Ahead with Essential Investor Updates: Track timely company news, press releases, and official announcements impacting your investments."
      />
      <CorporateAnnouncementsClient />
    </>
  );
};

export default CorporateAnnouncementsPage;
