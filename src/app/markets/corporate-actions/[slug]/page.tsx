import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import { fnGenerateMetaData, fetchFilters } from "@/utils/utility";
import PageHeaderSection from "@/components/Common/PageHeader";
import BreadCrumb from "@/components/BreadCrumb";
import CorporateActionsClient from "./client";
import { postRequest } from "@/utils/ajaxUtility";
import { ENDPOINT_MAPPING } from "./endpoint_mapping";

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
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const type = params.slug;
  if (!validPages.includes(type)) {
    notFound();
  }

  const niftyFilterData = {
    name: "All Stocks",
    exchange: "nse",
    seoname: "",
    indexId: 0,
  };
  const niftyData = await fetchFilters({ watchlist: true, all: true });

  /* To Fetch and pass listing data from SSR side */
  const reqFilters = {
    duration: "default",
    filterType: "",
    marketcap: "All",
    filterValue: [],
    pageSize: 15,
    pageNo: 1,
  };

  const cookieStore = cookies();
  const ssoid = cookieStore.get("ssoid")?.value;
  const ticketId = cookieStore.get("TicketId")?.value;

  const responseGetter = await postRequest(
    (ENDPOINT_MAPPING as any)[type]?.ep,
    reqFilters,
    { ssoid: ssoid, ticketId: ticketId },
  );

  let tableListing = [];
  if (["rights", "bonus"].includes(type)) {
    let data = responseGetter?.searchresult;
    data.forEach((ele: any) => {
      ele.ratio = `${ele?.ratioOffering || ele?.ratioOfferred}:${ele?.ratioExisting}`;
    });
    tableListing = data;
  } else {
    tableListing = responseGetter?.searchresult;
  }
  const pageSummery = {
    pageNo: 1,
    pageSize: 15,
    totalPages: responseGetter?.pagesummary?.totalpages,
    totalRecords: responseGetter?.pagesummary?.totalRecords,
  };

  return (
    <>
      <PageHeaderSection
        heading="Corporate Actions"
        description="Stay ahead of market-moving events! Track key corporate actions like Mergers, Buybacks, Dividends, Spinoffs, Reverse Stock Splits, Bonus Issues, and Right Issues with our comprehensive insights."
      />
      <CorporateActionsClient
        selectedFilter={niftyFilterData}
        niftyData={niftyData}
        pageSummery={pageSummery}
        tableListing={tableListing}
        flag={type}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Corporate Actions", redirectUrl: "" }]}
      />
    </>
  );
};

export default CorporateActionsSubPage;
