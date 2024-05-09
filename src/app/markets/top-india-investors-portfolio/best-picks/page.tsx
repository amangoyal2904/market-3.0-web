import { commonPostAPIHandler } from "../../../../utils/screeners";
import BigBullBestPicksPageClientPage from "./clients";
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
  const SubCategoryName = "Best Picks";
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

const BigBullBestPicksPage = async () => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const payload = {
    ssoId: "",
    primeFlag: 1,
    investorType: "INDIVIDUAL",
    position: "All",
    filterType: "index",
    filterValue: [],
    sortBy: "3MReturns",
    orderBy: "DESC",
    pageNo: 1,
    pageSize: 10,
  };
  const allData = await commonPostAPIHandler(`BigBullGetBestPicks`, payload);
  const __tableData: any[] =
    allData?.datainfo?.bestPicksDataInfo?.bestPicksListInfo || [];
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
      name: "Holdings%",
      id: "2",
      sort: true,
      primeFlag: false,
      orderBy: "holdingPercent",
    },
    {
      name: "Holdings (Rs in Cr.)",
      id: "3",
      sort: true,
      primeFlag: false,
      orderBy: "holdingValue",
    },
    {
      name: "3M Return %",
      id: "4",
      sort: true,
      primeFlag: false,
      orderBy: "3MReturns",
    },
    {
      name: "6M Returns %",
      id: "5",
      sort: true,
      primeFlag: false,
      orderBy: "6MReturns",
    },
  ];
  const __pagination =
    allData?.datainfo?.bestPicksDataInfo?.pageSummaryInfo || {};
  const bigBullData = {
    tableData: __tableData,
    tableHead: __tableHead,
    pagination: __pagination,
  };
  const selectedFilter = await fetchSelectedFilter(0);
  return (
    <>
      <BigBullBestPicksPageClientPage
        data={bigBullData}
        selectedFilter={selectedFilter}
        tableData={bigBullData.tableData}
        tableHead={bigBullData.tableHead}
        pagination={bigBullData.pagination}
        payload={payload}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Best Picks", redirectUrl: "" }]}
      />
    </>
  );
};

export default BigBullBestPicksPage;
