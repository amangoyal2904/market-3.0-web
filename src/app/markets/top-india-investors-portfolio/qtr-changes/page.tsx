import { commonPostAPIHandler } from "../../../../utils/screeners";
import BigBullQtrChangesPageClientPage from "./clients";
import { fetchSelectedFilter, fnGenerateMetaData } from "@/utils/utility";
import { headers } from "next/headers";
import BreadCrumb from "@/components/BreadCrumb";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { searchParams }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const SubCategoryName = "Qtr Changes";
  const seo_title = `${SubCategoryName} Investors, Top Investors in India, Investors Portfolio | The Economic Times Ex. - Best Picks Investors, Top Investors in India, Investors Portfolio | The Economic Times`;
  const seo_desc = `${SubCategoryName} Investors in India: Check the list of top Indian investors with detailed portfolio. Get all super investors & shareholders with their recently added stocks investments & corporate shareholdings at The Economic Times Ex. - Best Pick Investors in India: Check the list of top Indian investors with detailed portfolio. Get all super investors & shareholders with their recently added stocks investments & corporate shareholdings at The Economic Times`;
  const seo_keywords = `${SubCategoryName} Investors, ${SubCategoryName} Investors in India, Individual Investors, Institutional Investors, Investors Portfolio, Investors Portfolio list, ${SubCategoryName} Investors list, List of ${SubCategoryName} Investors Ex. - best pick Investors, best pick Investors in India, Individual Investors, Institutional Investors, Investors Portfolio, Investors Portfolio list, best pick Investors list, List of best pick Investors`;
  const meta = {
    title: seo_title,
    desc: seo_desc,
    keywords: seo_keywords,
    pathname: pageUrl,
  };
  return fnGenerateMetaData(meta);
}

const BigBullQtrChangesPage = async () => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const payload = {
    ssoId: "",
    primeFlag: 1,
    investorType: "INDIVIDUAL",
    position: "All",
    filterType: "index",
    filterValue: [],
    sortBy: "companyName",
    orderBy: "ASC",
    pageNo: 1,
    pageSize: 10,
  };
  const allData = await commonPostAPIHandler(`BigBullGetLastQuarter`, payload);
  const __tableData: any[] =
    allData?.datainfo?.investorKeyChanges?.investorKeyChangesData || [];
  const __tableHead: any[] = [
    {
      name: "Investors Name",
      id: "0",
      sort: false,
      primeFlag: false,
      orderBy: "name",
    },
    {
      name: "Company Name",
      id: "1",
      sort: false,
      primeFlag: false,
      orderBy: "companyName",
    },
    {
      name: "Curr. Holdings%",
      id: "2",
      sort: false,
      primeFlag: false,
      orderBy: "currHoldingPercent",
    },
    {
      name: "Prev. Holdings%",
      id: "3",
      sort: false,
      primeFlag: false,
      orderBy: "prevHoldingPercent",
    },
    {
      name: "Increase/Decrease",
      id: "4",
      sort: true,
      primeFlag: false,
      orderBy: "holdingPercentChange",
    },
    {
      name: "Amt. Invested /Sold (Rs in Cr.)",
      id: "5",
      sort: true,
      primeFlag: false,
      orderBy: "holdingValueChange",
    },
  ];
  const __pagination =
    allData?.datainfo?.investorKeyChanges?.pageSummaryInfo || {};
  const bigBullData = {
    tableData: __tableData,
    tableHead: __tableHead,
    pagination: __pagination,
  };
  const selectedFilter = await fetchSelectedFilter(0);
  return (
    <>
      <BigBullQtrChangesPageClientPage
        data={bigBullData}
        selectedFilter={selectedFilter}
        tableData={bigBullData.tableData}
        tableHead={bigBullData.tableHead}
        pagination={bigBullData.pagination}
        payload={payload}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Qtr Changes", redirectUrl: "" }]}
      />
    </>
  );
};

export default BigBullQtrChangesPage;
