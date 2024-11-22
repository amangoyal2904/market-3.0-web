"use client";

import HeroBanner from "@/components/StocksEarnings/HeroBanner";
import LinkTabs from "@/components/StocksEarnings/LinkTabs";
import DeclaredPage from "@/components/StocksEarnings/DeclaredPage";

const DeclaredResultsClintPage = ({ data, selectedFilter }: any) => {
  const _title = "Declared  Results";
  const _desc = `Discover the latest declared earnings results of all companies with a comprehensive day-by-day view. Easily search for individual stocks and apply filters to refine your search. Track Sales & Profit gainers and losers separately, providing a quick overview of performance trends. Get a clear and focused view of top and bottom performers, making it easy to spot key shifts in market dynamics`;
  const queryParameter =
    data?.props?.searchParams?.companyid !== ""
      ? data?.props?.searchParams?.companyid
      : "";
  const queryResult =
    data?._declaredCompaniesQuery &&
    data?._declaredCompaniesQuery?.declaredCompanies &&
    data?._declaredCompaniesQuery?.declaredCompanies.length > 0
      ? data?._declaredCompaniesQuery
      : "";
  const queryTitle =
    queryResult !== "" ? queryResult?.declaredCompanies[0]?.assetName : "";
  //console.log("_data_", queryTitle);

  return (
    <>
      <HeroBanner title={_title} desc={_desc} />
      <LinkTabs />
      <DeclaredPage
        data={data}
        queryParameter={queryParameter}
        queryResult={queryResult}
        selectedFilter={selectedFilter}
        paginationTxt="Declard Results"
        queryTitle={queryTitle}
        activeResultTxt="latest-results"
      />
    </>
  );
};

export default DeclaredResultsClintPage;
