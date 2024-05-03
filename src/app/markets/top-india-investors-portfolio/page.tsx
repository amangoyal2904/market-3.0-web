import styles from "./style.module.scss";
import { commonPostAPIHandler } from "../../../utils/screeners";
import BigBullClientPage from "./clients";
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
  const seo_title =
    "Top Investors in India, List of Individual & Institutional Investors, Investors Portfolio | The Economic Times";
  const seo_desc =
    "Top Investors in India: Check the list of top Indian investors with detailed portfolio. Get all super investors & shareholders with their recently added stocks investments & corporate shareholdings at The Economic Times";
  const seo_keywords =
    "Top Investors, Top Investors in India, Individual Investors, Institutional Investors, Investors Portfolio, Investors Portfolio list, Top Investors list, List of Top Investors, super investor, super investor in India, super investors list, super investor portfolio, super investor stocks";
  const meta = {
    title: seo_title,
    desc: seo_desc,
    keywords: seo_keywords,
    pathname: pageUrl,
  };
  return fnGenerateMetaData(meta);
}

const BigBullPage = async () => {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";

  const payload = {
    ssoId: "",
    investorType: "INDIVIDUAL",
    sortBy: "networth",
    orderBy: "DESC",
    primeFlag: 1,
    pageSize: 3,
    pageNo: 1,
  };
  const data = await commonPostAPIHandler(
    `BigBullAllInverstorOverview`,
    payload,
  );
  const bigBullData = {
    pageData: data.datainfo,
  };
  return (
    <>
      {/* {JSON.stringify(pageUrl)} */}
      <BigBullClientPage data={bigBullData} />
      <BreadCrumb
        pagePath={pageUrl}
        pageName={[{ label: "Overview", redirectUrl: "" }]}
      />
    </>
  );
};

export default BigBullPage;
