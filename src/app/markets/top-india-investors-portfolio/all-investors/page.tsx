import { commonPostAPIHandler } from "../../../../utils/screeners";
import BigBullAllInvertorsPageClientPage from "./clients";
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
  const SubCategoryName = "All";
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

const BigBullAllInvertorsPage = async () => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const individualInvestorsBodyParams = {
    ssoId: "",
    investorType: "INDIVIDUAL",
    sortBy: "networth",
    orderBy: "DESC",
    primeFlag: 1,
    pageSize: 10,
    pageNo: 1,
  };
  const IndividualInvestors = await commonPostAPIHandler(
    `BigBullGetInvestorList`,
    individualInvestorsBodyParams,
  );
  const __tableData: any[] =
    IndividualInvestors?.datainfo?.investorlist?.investorData || [];
  const __tableHead: any[] = [
    {
      name: "Investors Name",
      id: "0",
      sort: true,
      primeFlag: false,
      orderBy: "name",
    },
    {
      name: "No. Of Companies",
      id: "1",
      sort: true,
      primeFlag: false,
      orderBy: "noOfCompanies",
    },
    {
      name: "Networth (Cr)",
      id: "2",
      sort: true,
      primeFlag: false,
      orderBy: "networth",
    },
    {
      name: "Networth (QoQ)",
      id: "3",
      sort: true,
      primeFlag: false,
      orderBy: "3MReturn",
    },
    {
      name: "Best Picks",
      id: "4",
      sort: false,
      primeFlag: false,
      orderBy: "bestPick",
    },
    {
      name: "Top Activity",
      id: "5",
      sort: false,
      primeFlag: false,
      orderBy: "mostIncrease",
    },
  ];
  const __pagination =
    IndividualInvestors?.datainfo?.investorlist?.pageSummaryInfo || {};
  const bigBullData = {
    pageData: IndividualInvestors?.datainfo?.investorlist || {},
    tableData: __tableData,
    tableHead: __tableHead,
    pagination: __pagination,
  };
  return (
    <>
      <BigBullAllInvertorsPageClientPage
        tableData={bigBullData.tableData}
        tableHead={bigBullData.tableHead}
        pagination={bigBullData.pagination}
      />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "All Investors", redirectUrl: "" }]}
      />
    </>
  );
};

export default BigBullAllInvertorsPage;
