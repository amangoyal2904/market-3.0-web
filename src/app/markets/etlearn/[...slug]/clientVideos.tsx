"use client";

import ETLearnTabs from "@/components/ETLearn/Tabs";
import TopHero from "@/components/ETLearn/TopHero";
import InvestEdgeVideoBox from "@/components/InvestEdgeVideoList/InvestEdgeVideoBox";
import BreadCrumb from "@/components/BreadCrumb";

const ClientVideos = ({ invementIdeaNavResult, slug, sectionData }: any) => {
  const getSectionName = () => {
    const activeObj = invementIdeaNavResult?.tabs.filter(
      (item: any) => item.seoPath == `/markets/etlearn/${slug?.[0]}`,
    );
    return activeObj[0]?.label;
  };
  const heroVideoData =
    sectionData.length > 0 &&
    sectionData.find((slide: any) => slide.msid == slug[2]);
  const pageTitle = heroVideoData?.title || "";

  const videoData = {
    title: getSectionName(),
    invementIdeaNavResult: invementIdeaNavResult,
    sectionData: sectionData,
    pageSlug: slug[0],
    videoMsid: slug[2],
  };
  const pageDesc =
    "Curated videos on stocks, mutual funds, investment strategies & more to help you manage your wealth seamlessly.";
  return (
    <>
      <TopHero head={getSectionName()} desc={pageDesc} link="" />
      <ETLearnTabs tabData={invementIdeaNavResult?.tabs} />
      <InvestEdgeVideoBox data={videoData} slug={slug} />

      <BreadCrumb
        pagePath={`/markets/etlearn/${slug[0]}`}
        pageName={[
          {
            label: getSectionName(),
            redirectUrl: `/markets/etlearn/${slug[0]}`,
          },
          { label: pageTitle, redirectUrl: "" },
        ]}
      />
    </>
  );
};

export default ClientVideos;
