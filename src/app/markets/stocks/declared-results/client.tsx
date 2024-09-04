"use client";

import HeroBanner from "@/components/StocksEarnings/HeroBanner";
import LinkTabs from "@/components/StocksEarnings/LinkTabs";
import DeclaredPage from "@/components/StocksEarnings/DeclaredPage";

const DeclaredResultsClintPage = ({ data, selectedFilter }: any) => {
  const _title = "Declared  Results";
  const _desc = `A quarterly report is a summary or collection of unaudited financial statements, such as balance sheets, income statements, and cash flow statements, issued by companies every quarter (three months). The quarterly reports and financial statements indicate the business's quarterly development. To protect the interests of investors, SEBI (Securities and Exchange Board of India) requires every listed firm to produce quarterly reports.`;
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

  console.log("_data_", data);

  return (
    <>
      <HeroBanner title={_title} desc={_desc} />
      <LinkTabs />
      <DeclaredPage
        data={data}
        queryParameter={queryParameter}
        queryResult={queryResult}
        selectedFilter={selectedFilter}
      />
    </>
  );
};

export default DeclaredResultsClintPage;
