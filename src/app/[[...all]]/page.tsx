import { pageType } from "@/utils";
import NotFound from "@/containers/NotFound";

export default async function Page({
  params,
  searchParams,
}: {
  params: { all: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { all = [] } = params;
  let page = pageType(all.join("/"));
  console.log("Page???", page);
  return <NotFound />;
}
