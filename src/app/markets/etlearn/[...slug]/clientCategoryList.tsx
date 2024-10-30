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
  const pageDesc =
    "Curated videos on stocks, mutual funds, investment strategies & more to help you manage your wealth seamlessly.";

  const getSectionName = () => {
    const activeObj = invementIdeaNavResult?.tabs.filter(
      (item: any) => item.apiSlug == `/${slug?.[0]}`,
    );
    return activeObj[0]?.label;
  };
  //console.log("sectionData",invementIdeaNavResult?.tabs, slug)
  return (
    <>
      <TopHero head="ET Learn" desc={pageDesc} link="/markets/etlearn" />
      <ETLearnTabs tabData={invementIdeaNavResult?.tabs} />
      <InvestEdgeVideoList
        title={getSectionName()}
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
