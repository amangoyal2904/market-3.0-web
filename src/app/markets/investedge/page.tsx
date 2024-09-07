import { fnGenerateMetaData } from "@/utils/utility";
import { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";
import styles from "./Investedge.module.scss";
import InvestEdgeClient from "./client";
import service from "@/network/service";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import Tabbing from "@/components/InvestEdgeTopVideo/Tabbing";

import Link from "next/link";
import { trackingEvent } from "@/utils/ga";
import InvestEdgeClient1 from "./client1";

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

const InvestEdge = async () => {
  const InvestmentIdea_Link = (APIS_CONFIG as any)["INVESTMENTIDEA_NAV"][
    APP_ENV
  ];
  const invementIdeaNavPromise = await service.get({
    url: InvestmentIdea_Link,
    params: {},
  });
  const invementIdeaNavResult = await invementIdeaNavPromise?.json();
  console.log("invementIdeaNavResult----->", invementIdeaNavResult);
  // Generate full data from multiple requests
  // Generate full data with label and section data
  const generateFullData = async () => {
    const getSectionResult_Link = (APIS_CONFIG as any)["INVESTMENTEDGE"][
      APP_ENV
    ];
    console.log("URL-->", getSectionResult_Link);

    // Using Promise.all to handle multiple async requests
    const promises = invementIdeaNavResult?.tabs.map(async (item: any) => {
      const getSectionPromise = await service.get({
        url: getSectionResult_Link + item.msid,
        params: {},
      });

      const getSectionResult = await getSectionPromise?.json();
      const getSectionData = getSectionResult.searchResult[0]?.data || [];

      // Return an object with label and data
      return {
        label: item.label, // Label node from item
        data: getSectionData, // Output node from getSectionData
      };
    });

    // Wait for all promises and return the array of label and data objects
    const fullData = await Promise.all(promises);
    return fullData;
  };

  const getResult = await generateFullData(); // Await the result of generateFullData
  console.log("getResult----->", getResult);

  return (
    <>
      <h1 className={styles.title}>Invest Edge</h1>
      <p className={styles.desc}>
        Curated videos on stocks, mutual funds, investment strategies & more to
        help you manage your wealth seamlessly.
      </p>

      {/* <Tabbing invementIdeaNavResult ={invementIdeaNavResult}/> */}
      {/* <InvestEdgeClient navResult={invementIdeaNavResult}/> */}
      {/* {invementIdeaNavResult?.tabs.map((item: any, index: any) => (
            <InvestEdgeClient key={index} navResult={item}/>
        ))} */}
      <InvestEdgeClient1
        resultData={getResult}
        invementIdeaNavResult={invementIdeaNavResult}
      />
    </>
  );
};

export default InvestEdge;
