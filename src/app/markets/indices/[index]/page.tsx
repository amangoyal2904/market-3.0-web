import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import IndicesClient from "../clients";
import { headers } from "next/headers";
import {
  fetchFilters,
  fetchSelectedFilter,
  fnGenerateMetaData,
} from "@/utils/utility";

async function fetchData(indexId: number) {
  return Promise.all([fetchFilters({})]);
}

async function generateMetadata(
  { params }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headersList = headers();
  const niftyFilterData = await fetchSelectedFilter(params.index);
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title: `${niftyFilterData.name} Live | NSE ${niftyFilterData.name} Index Today - S&P CNX ${niftyFilterData.name}`,
    desc: `${niftyFilterData.name} Today | ${niftyFilterData.name} Live Updates- ${niftyFilterData.name} Index, S&P CNX NSE. Find today's trend for ${niftyFilterData.name} Companies, News, Target Price, Stock Price, Stock Analysis`,
    keywords: `${niftyFilterData.name}, ${niftyFilterData.name} Today, ${niftyFilterData.name} Live, ${niftyFilterData.name} Index`,
    pathname: pageUrl,
    index: niftyFilterData.indexId == 0 ? false : true,
  };
  return fnGenerateMetaData(meta);
}

const Indices = async ({ params }: any) => {
  const niftyFilterData = await fetchSelectedFilter(params.index);
  if (niftyFilterData.indexId == 0) {
    notFound();
  }
  const [allFilters] = await fetchData(niftyFilterData.indexId);
  return <IndicesClient allFilters={allFilters} />;
};

export { generateMetadata, Indices as default };
