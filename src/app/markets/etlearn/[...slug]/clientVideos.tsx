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
  const pageDesc = () => {
    const activeObj = invementIdeaNavResult?.tabs.filter(
      (item: any) => item.apiSlug == `/${slug?.[0]}`,
    );
    return activeObj[0]?.desc;
  };

  return (
    <>
      <TopHero head={getSectionName()} headTag="h2" desc={pageDesc()} link="" />
      <ETLearnTabs tabData={invementIdeaNavResult?.tabs} />
      <InvestEdgeVideoBox
        data={videoData}
        headTag="h1"
        slug={slug}
        selectedcategory={getSectionName()}
      />

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
