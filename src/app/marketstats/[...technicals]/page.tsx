import useMarketStatsNav from "../useMarketStatsNav";
import useTechnicalTab from "../useTechnicalTab";
import useTechnicalTable from "../useTechnicalTable";
import Marketstats from "../marketstats";
import tableConfig from "@/utils/tableConfig.json";
import tabConfig from "@/utils/tabConfig.json";
import useSelectedFilter from "../useSelectedFilter";
import useTechnicalFilters from "../useTechnicalFilters";
import { cookies } from "next/headers";

// export async function generateMetadata(
//   { searchParams, params }: any,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const type = searchParams?.type;
//   const firstOperand = searchParams?.firstoperand;
//   const operationType = searchParams?.operationtype;
//   const secondOperand = searchParams?.secondoperand;
//   const intFilter = searchParams.filter ? parseInt(searchParams.filter) : 0;

//   const { metaData } = await useMarketStatsNav({ type, intFilter });

//   const technicalCategory = await useTechnicalFilters(
//     params,
//     type,
//     firstOperand,
//     operationType,
//     secondOperand
//   );
//   const title = metaData[0]?.title;
//   const desc = `Discover the stocks in the Indian stock market with ${technicalCategory?.selectedFilterLabel?.firstOperand} ${technicalCategory?.selectedFilterLabel?.operationType} ${technicalCategory?.selectedFilterLabel?.secondOperand} exclusively on The Economic Times`;
//   const meta = {
//     title: title,
//     desc: desc,
//     keywords: `et, etmarkets, economictimes, ${params}, ${type}, ${firstOperand}, ${operationType}, ${secondOperand}`,
//     index: false,
//   };
//   return fnGenerateMetaData(meta);
// }

const MovingAverages = async ({ searchParams, params }: any) => {
  const cookieStore = cookies();
  const isprimeuser = cookieStore.get("isprimeuser")
    ? cookieStore.get("isprimeuser")?.value
    : false;
  const ssoid = cookieStore.get("ssoid")?.value;
  const type = searchParams?.type;
  const intFilter = searchParams.filter ? parseInt(searchParams.filter) : 0;
  const filter = !!intFilter ? [intFilter] : [];
  const firstOperand = searchParams?.firstoperand;
  const operationType = searchParams?.operationtype;
  const secondOperand = searchParams?.secondoperand;
  const pagesize = 100;
  const pageno = 1;
  const sort: any = [];

  const { l3Nav, metaData } = await useMarketStatsNav({ type, intFilter });

  const { tabData, activeViewId } = await useTechnicalTab({
    firstOperand,
    operationType,
    secondOperand,
    ssoid,
  });

  const { tableHeaderData, tableData, pageSummary, payload } =
    await useTechnicalTable({
      activeViewId,
      filter,
      firstOperand,
      operationType,
      secondOperand,
      sort,
      pagesize,
      pageno,
      isprimeuser,
      ssoid,
    });

  const selectedFilter = await useSelectedFilter(intFilter);
  const technicalCategory = await useTechnicalFilters(
    params,
    type,
    firstOperand,
    operationType,
    secondOperand,
  );

  const title = metaData[0]?.title;
  const desc = `Discover the stocks in the Indian stock market with ${technicalCategory?.selectedFilterLabel?.firstOperand} ${technicalCategory?.selectedFilterLabel?.operationType} ${technicalCategory?.selectedFilterLabel?.secondOperand} exclusively on The Economic Times`;
  const meta = {
    title: title,
    desc: desc,
  };

  return (
    <>
      <Marketstats
        l3Nav={l3Nav}
        metaData={meta}
        tabData={tabData}
        activeViewId={activeViewId}
        tableHeaderData={tableHeaderData}
        tableData={tableData}
        pageSummary={pageSummary}
        selectedFilter={selectedFilter}
        isTechnical={true}
        technicalCategory={technicalCategory}
        tableConfig={tableConfig["marketStatsTechnical"]}
        tabConfig={tabConfig["marketStatsTechnical"]}
        payload={payload}
        ssoid={ssoid}
        isprimeuser={isprimeuser}
      />
    </>
  );
};

export default MovingAverages;
