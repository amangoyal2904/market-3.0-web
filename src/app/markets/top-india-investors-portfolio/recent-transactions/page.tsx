import { commonPostAPIHandler } from "../../../../utils/screeners";
import BigBullRecentTransactionsPageClientPage from "./clients";
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
  const SubCategoryName = "Recent Transactions";
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

const BigBullRecentTransactionsPage = async () => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const payload = {
    ssoId: "",
    primeFlag: 1,
    investorType: "INDIVIDUAL",
    position: "All",
    filterType: "index",
    filterValue: [],
    sortBy: "dealDate",
    orderBy: "DESC",
    timeSpan: "",
    pageNo: 1,
    pageSize: 10,
  };
  const allData = await commonPostAPIHandler(
    `BigBullGetRecentTransactions`,
    payload,
  );
  const __tableData: any[] =
    allData?.datainfo?.recentDealsInfo?.listRecentDeals || [];
  const __tableHead: any[] = [
    {
      name: "Investors Name",
      id: "0",
      sort: false,
      primeFlag: false,
      orderBy: "name",
    },
    {
      name: "Buy / Sell",
      id: "01",
      sort: false,
      primeFlag: false,
      orderBy: "",
    },
    {
      name: "Company Name",
      id: "1",
      sort: false,
      primeFlag: false,
      orderBy: "companyName",
    },
    {
      name: "Trans. Value(Cr.)",
      id: "2",
      sort: true,
      primeFlag: false,
      orderBy: "dealValue",
    },
    {
      name: "Stake Bought/ Sold",
      id: "3",
      sort: true,
      primeFlag: false,
      orderBy: "dealStakePercent",
    },
    {
      name: "Chg. Since Bought",
      id: "4",
      sort: true,
      primeFlag: false,
      orderBy: "changeSinceDeal",
    },
    {
      name: "Deal Qty.",
      id: "5",
      sort: true,
      primeFlag: false,
      orderBy: "dealQuantity",
    },
    {
      name: "Deal Price (Rs)",
      id: "6",
      sort: true,
      primeFlag: false,
      orderBy: "dealPrice",
    },
  ];
  const __pagination =
    allData?.datainfo?.recentDealsInfo?.pageSummaryInfo || {};
  const bigBullData = {
    tableData: __tableData,
    tableHead: __tableHead,
    pagination: __pagination,
  };
  const selectedFilter = await fetchSelectedFilter(0);
  return (
    <>
      <BigBullRecentTransactionsPageClientPage
        data={bigBullData}
        selectedFilter={selectedFilter}
        tableData={bigBullData.tableData}
        tableHead={bigBullData.tableHead}
        pagination={bigBullData.pagination}
        payload={payload}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Recent Transactions", redirectUrl: "" }]}
      />
    </>
  );
};

export default BigBullRecentTransactionsPage;
