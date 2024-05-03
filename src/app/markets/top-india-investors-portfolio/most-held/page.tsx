import { commonPostAPIHandler } from "../../../../utils/screeners";
import BigBullMostHeldClientPage from "./clients";
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
  const SubCategoryName = "Most  Held";
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

const BigBullMostHeldPage = async () => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const payload = {
    ssoId: "",
    primeFlag: 1,
    investorType: "INDIVIDUAL",
    position: "All",
    filterType: "index",
    filterValue: [],
    sortBy: "noOfBulls",
    orderBy: "DESC",
    pageNo: 1,
    pageSize: 10,
  };
  const allData = await commonPostAPIHandler(`BigBullGetMostHeld`, payload);
  const __tableData: any[] =
    allData?.datainfo?.mostHoldCompanyInfo?.mostHoldStockData || [];
  const __tableHead: any[] = [
    {
      name: "Company Name",
      id: "1",
      sort: false,
      primeFlag: false,
      orderBy: "companyName",
    },
    {
      name: "Held By",
      id: "11",
      sort: false,
      primeFlag: false,
      orderBy: "noOfBulls",
    },
    {
      name: "Bull Holdings%",
      id: "2",
      sort: true,
      primeFlag: false,
      orderBy: "bullHolding",
    },
    {
      name: "Bull Holdings (Rs in Cr.)",
      id: "3",
      sort: true,
      primeFlag: false,
      orderBy: "bullHoldingValue",
    },
    {
      name: "3M Return %",
      id: "4",
      sort: true,
      primeFlag: false,
      orderBy: "3MReturn",
    },
    {
      name: "6M Returns %",
      id: "5",
      sort: true,
      primeFlag: false,
      orderBy: "6MReturn",
    },
  ];
  const __pagination =
    allData?.datainfo?.mostHoldCompanyInfo?.pageSummaryInfo || {};
  const __lastUpdatedQtr =
    allData?.datainfo?.mostHoldCompanyInfo?.lastUpdatedQtr || "";
  const bigBullData = {
    tableData: __tableData,
    tableHead: __tableHead,
    pagination: __pagination,
    lastUpdatedQtr: __lastUpdatedQtr,
  };
  const selectedFilter = await fetchSelectedFilter(0);
  return (
    <>
      <BigBullMostHeldClientPage
        data={bigBullData}
        selectedFilter={selectedFilter}
        tableData={bigBullData.tableData}
        tableHead={bigBullData.tableHead}
        pagination={bigBullData.pagination}
        lastUpdatedQtr={bigBullData.lastUpdatedQtr}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Most Held", redirectUrl: "" }]}
      />
    </>
  );
};

export default BigBullMostHeldPage;
