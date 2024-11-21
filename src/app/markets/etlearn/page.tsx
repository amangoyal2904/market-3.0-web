import { fnGenerateMetaData } from "@/utils/utility";
import { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";
import ETLearnClient from "./client";
import service from "@/network/service";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import BreadCrumb from "@/components/BreadCrumb";

export async function generateMetadata(
  { searchParams }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title:
      "ET Learn Stock Market, Mutual Funds & Investment Styles : Learning  Videos & Live Stream",
    desc: "ET Learn offers video guide to learn manage stocks, mutual funds, and investment strategies, along with expert tips for making informed decisions. Boost your financial knowledge with latest videos on mutual funds, fixed income, and portfolio management",
    keywords:
      "Mutual Funds India, Best Mutual Funds,  Best Performing Mutual Funds, Learn Mutual Funds",
    pathname: pageUrl,
    index: true,
  };
  return fnGenerateMetaData(meta);
}

const InvestEdge = async () => {
  const InvestmentIdea_Link = (APIS_CONFIG as any)["INVESTMENTIDEA_NAV"][
    APP_ENV
  ];
  const invementIdeaNavPromise = await service.get({
    url: InvestmentIdea_Link,
    params: {},
  });
  const invementIdeaNavResult = await invementIdeaNavPromise?.json();
  // Generate full data from multiple requests
  // Generate full data with label and section data
  const generateFullData = async () => {
    const getSectionResult_Link = (APIS_CONFIG as any)["INVESTMENTEDGE"][
      APP_ENV
    ];

    // Using Promise.all to handle multiple async requests
    const promises = invementIdeaNavResult?.tabs.map(async (item: any) => {
      //console.log("_____url", getSectionResult_Link + item.msid);
      const getSectionPromise = await service.get({
        url: getSectionResult_Link + item.msid,
        params: {},
      });

      const getSectionResult = await getSectionPromise?.json();
      const getSectionData = getSectionResult?.searchResult[0]?.data || [];
      // Return an object with label and data
      return {
        label: item.label, // Label node from item
        data: getSectionData,
        seoPath: item.seoPath, // Output node from getSectionData
      };
    });

    // Wait for all promises and return the array of label and data objects
    const fullData = await Promise.all(promises);
    return fullData;
  };

  const getResult: any = await generateFullData();

  return (
    <>
      <ETLearnClient
        resultData={getResult}
        invementIdeaNavResult={invementIdeaNavResult}
      />
      <BreadCrumb
        pagePath={`/markets/etlearn`}
        pageName={[{ label: "ETLearn", redirectUrl: "" }]}
      />
    </>
  );
};

export default InvestEdge;
