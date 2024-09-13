import { fnGenerateMetaData } from "@/utils/utility";
import { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";
import InvestEdgeVideoList from "@/components/InvestEdgeVideoList";
import styles from "../../Investedge.module.scss";
import service from "@/network/service";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import { IeTab } from "@/components/InvestEdgeVideoList/IeTab";
import InvestEdgeVideoBox from "@/components/InvestEdgeVideoList/InvestEdgeVideoBox";

export async function generateMetadata(
  { searchParams }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title:
      "Share Market, Nifty, Sensex, NSE/BSE Live Updates, Stock Market Today",
    desc: "Curated videos on stocks, mutual funds, investment strategies & more to help you manage your wealth seamlessly.",
    keywords:
      "Share Market, Stock Market, share market live updates, NIFTY, Sensex Today live, NSE/BSE, big bull, stock reports, stock screeners, indices, market mood, forex, commodity, top investors",
    pathname: pageUrl,
    index: true,
  };
  return fnGenerateMetaData(meta);
}
const Video = async ({
  params,
  searchParams,
}: {
  params: {
    slug: string[];
  };
  searchParams: any;
}) => {
  const { slug } = params || [];
  console.log("Slug--->", slug);
  const InvestmentIdea_Link = (APIS_CONFIG as any)["INVESTMENTIDEA_NAV"][
    APP_ENV
  ];
  const invementIdeaNavPromise = await service.get({
    url: InvestmentIdea_Link,
    params: {},
  });
  const invementIdeaNavResult = await invementIdeaNavPromise?.json();
  const getMsid = () => {
    const activeObj = invementIdeaNavResult?.tabs.filter(
      (item: any) => item.seoPath == slug?.[0],
    );
    return activeObj[0]?.msid;
  };
  const getSectionName = () => {
    const activeObj = invementIdeaNavResult?.tabs.filter(
      (item: any) => item.seoPath == slug?.[0],
    );
    return activeObj[0]?.label;
  };

  const getSectionResult_Link =
    (APIS_CONFIG as any)["INVESTMENTEDGE"][APP_ENV] + getMsid();
  const getSectionPromise = await service.get({
    url: getSectionResult_Link,
    params: {},
  });
  const getSectionResult = await getSectionPromise?.json();
  const getSectionData = getSectionResult.searchResult[0].data || [];
  return (
    <>
      <h1 className={styles.title}>Invest Edge</h1>
      <p className={styles.desc}>
        Curated videos on stocks, mutual funds, investment strategies & more to
        help you manage your wealth seamlessly.
      </p>
      <IeTab
        invementIdeaNavResult={invementIdeaNavResult}
        activeTab={slug?.[0]}
        slug={slug}
      />
      <InvestEdgeVideoBox
        title={getSectionName()}
        invementIdeaNavResult={invementIdeaNavResult}
        sectionData={getSectionData}
        slug={slug}
      />
    </>
  );
};

export default Video;
