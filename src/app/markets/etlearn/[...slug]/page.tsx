import { fnGenerateMetaData } from "@/utils/utility";
import { Metadata, ResolvingMetadata } from "next";
import service from "@/network/service";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV, getSeoNameFromUrl } from "@/utils";
import ClientCategoryList from "./clientCategoryList";
import ClientVideos from "./clientVideos";
import { notFound } from "next/navigation";

export async function generateMetadata(
  { params }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = params || [];
  const pageUrl = `/${slug[0]}`;
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
      (item: any) => item.apiSlug === pageUrl,
    );
    return activeObj[0]?.msid;
  };
  const getSectionResult_Link =
    (APIS_CONFIG as any)["INVESTMENTEDGE"][APP_ENV] + getMsid();
  const getSectionPromise = await service.get({
    url: getSectionResult_Link,
    params: {},
  });
  const getSectionResult = await getSectionPromise?.json();
  const getSectionData = getSectionResult.searchResult[0].data || [];

  const getSectionName = () => {
    const activeObj = invementIdeaNavResult?.tabs.filter(
      (item: any) => item.apiSlug == `/${slug?.[0]}`,
    );
    return activeObj[0]?.label;
  };

  const category = getSectionName();
  let seoPageUrl = "";
  let heroVideoData: any = {};
  let seoTitle = "";
  let seoDesc = "";
  let seoKeyword = "";

  if (slug.length === 1) {
    seoPageUrl = `/markets/etlearn/${slug[0]}`;
    seoTitle = `ET Learn Video Guide on ${category} Management `;
    seoDesc = `ET Learn offers video guide on ${category}, tax-saving schemes, performance analysis, and expert tips to make informed investment decisions. Boost your financial knowledge with latest videos on mutual funds, fixed income, and more.`;
    seoKeyword =
      "Mutual Funds India, Best Mutual Funds,  Best Performing Mutual Funds, Learn Mutual Funds";
  } else if (slug.length === 3) {
    heroVideoData =
      getSectionData.length > 0 &&
      getSectionData.find((slide: any) => slide.msid == slug[2]);
    seoPageUrl = `/markets/etlearn/${slug[0]}/${getSeoNameFromUrl(heroVideoData?.url, "videoshow")}/${slug[2]}`;
    seoTitle = heroVideoData?.title;
    seoDesc = heroVideoData?.synopsis;
    seoKeyword = "";
  }
  //console.log("___heroVideoData____",heroVideoData)

  const meta = {
    title: seoTitle,
    desc: seoDesc,
    keywords: seoKeyword,
    pathname: seoPageUrl,
    index: true,
  };
  return fnGenerateMetaData(meta);
}

const AllETlearnPage = async ({ params }: any) => {
  const { slug } = params || [];
  const pageUrl = `/${slug[0]}`;
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
      (item: any) => item.apiSlug === pageUrl,
    );
    return activeObj[0]?.msid;
  };

  const getSectionResult_Link =
    (APIS_CONFIG as any)["INVESTMENTEDGE"][APP_ENV] + getMsid();
  const getSectionPromise = await service.get({
    url: getSectionResult_Link,
    params: {},
  });
  const getSectionResult = await getSectionPromise?.json();
  const getSectionData = getSectionResult?.searchResult[0]?.data || [];

  if (slug.length === 1) {
    if (getSectionData.length === 0) {
      return (
        <>
          return <>{notFound()}</>;
        </>
      );
    }
    return (
      <>
        <ClientCategoryList
          invementIdeaNavResult={invementIdeaNavResult}
          sectionData={getSectionData}
          slug={slug}
        />
      </>
    );
  } else if (slug.length === 3) {
    if (getSectionData.length === 0) {
      return (
        <>
          return <>{notFound()}</>;
        </>
      );
    }
    return (
      <>
        <ClientVideos
          invementIdeaNavResult={invementIdeaNavResult}
          sectionData={getSectionData}
          slug={slug}
        />
      </>
    );
  } else {
    return <>{notFound()}</>;
  }
};

export default AllETlearnPage;
