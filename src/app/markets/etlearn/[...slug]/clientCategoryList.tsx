"use client";

import ETLearnTabs from "@/components/ETLearn/Tabs";
import TopHero from "@/components/ETLearn/TopHero";
import InvestEdgeVideoList from "@/components/InvestEdgeVideoList";
import BreadCrumb from "@/components/BreadCrumb";

const ClientCategoryList = ({
  invementIdeaNavResult,
  sectionData,
  slug,
}: any) => {
  const getSectionName = () => {
    const activeObj = invementIdeaNavResult?.tabs.filter(
      (item: any) => item.apiSlug == `/${slug?.[0]}`,
    );
    return activeObj[0]?.label;
  };
  const pageDesc = () => {
    const activeObj = invementIdeaNavResult?.tabs.filter(
      (item: any) => item.apiSlug == `/${slug?.[0]}`,
    );
    return activeObj[0]?.desc;
  };
  //console.log("sectionData",invementIdeaNavResult?.tabs, slug)
  return (
    <>
      <TopHero head="ET Learn" headTag="h2" desc={pageDesc()} link="" />
      <ETLearnTabs tabData={invementIdeaNavResult?.tabs} />
      <InvestEdgeVideoList
        title={getSectionName()}
        headTag="h1"
        invementIdeaNavResult={invementIdeaNavResult}
        sectionData={sectionData}
        slug={slug}
      />
      <BreadCrumb
        pagePath={`/markets/etlearn/${slug[0]}`}
        pageName={[{ label: getSectionName(), redirectUrl: "" }]}
      />
    </>
  );
};

export default ClientCategoryList;
