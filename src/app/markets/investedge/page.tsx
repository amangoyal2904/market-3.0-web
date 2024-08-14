import { fnGenerateMetaData } from "@/utils/utility";
import { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(
  { searchParams }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title:
      "Share Market, Nifty, Sensex, NSE/BSE Live Updates, Stock Market Today",
    desc: "Share Market & Stock Market Live Updates - Latest share market live updates on NIFTY, Sensex Today live, NSE/BSE, big bull, stock reports, stock screeners, indices, market mood, forex, commodity, top investors at The Economic Times",
    keywords:
      "Share Market, Stock Market, share market live updates, NIFTY, Sensex Today live, NSE/BSE, big bull, stock reports, stock screeners, indices, market mood, forex, commodity, top investors",
    pathname: pageUrl,
    index: true,
  };
  return fnGenerateMetaData(meta);
}

const InvestEdge = () => {
  return <div>page</div>;
};

export default InvestEdge;
