"use client";

import HeroBanner from "@/components/StocksEarnings/HeroBanner";
import LinkTabs from "@/components/StocksEarnings/LinkTabs";
import DeclaredPage from "@/components/StocksEarnings/DeclaredPage";

const DeclaredResultsSalesGainersClient = ({ data, selectedFilter }: any) => {
  const _title = "Sales Gainers  Results";
  const _desc = ``;
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

  //console.log("_data_", data);

  return (
    <>
      <HeroBanner title={_title} desc={_desc} />
      <LinkTabs />
      <DeclaredPage
        data={data}
        queryParameter={queryParameter}
        queryResult={queryResult}
        selectedFilter={selectedFilter}
        topTabTimeHide="yes"
        paginationTxt="Sales Gainers Results"
        activeResultTxt="sales-gainers"
      />
    </>
  );
};

export default DeclaredResultsSalesGainersClient;
