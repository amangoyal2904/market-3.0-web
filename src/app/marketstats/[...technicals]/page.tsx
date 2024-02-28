import tableConfig from "@/utils/tableConfig.json";
import tabConfig from "@/utils/tabConfig.json";
import { cookies } from "next/headers";
import { fnGenerateMetaData, getSelectedFilter } from "@/utils/utility";
import { Metadata, ResolvingMetadata } from "next";
import { getMarketStatsNav, getTechincalOperands } from "@/utils/marketstats";
import {
  getCustomViewTable,
  getCustomViewsTab,
} from "@/utils/customViewAndTables";
import MarketStats from "../client";

export async function generateMetadata(
  { searchParams, params }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const type = searchParams?.type;
  const firstOperand = searchParams?.firstoperand;
  const operationType = searchParams?.operationtype;
  const secondOperand = searchParams?.secondoperand;
  const intFilter = searchParams.filter ? parseInt(searchParams.filter) : 0;

  const { metaData } = await getMarketStatsNav({ type, intFilter });

  const technicalCategory = await getTechincalOperands(
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
    keywords: `et, etmarkets, economictimes, ${params}, ${type}, ${firstOperand}, ${operationType}, ${secondOperand}`,
    index: false,
  };
  return fnGenerateMetaData(meta);
}

const MovingAverages = async ({ searchParams, params }: any) => {
  const cookieStore = cookies();
  const isprimeuser = cookieStore.get("isprimeuser") ? true : false;
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

  const { l3Nav, metaData } = await getMarketStatsNav({ type, intFilter });

  const { tabData, activeViewId } = await getCustomViewsTab({
    firstOperand,
    operationType,
    secondOperand,
    ssoid,
  });

  const bodyParams = {
    viewId: activeViewId,
    apiType: type,
    firstOperand,
    operationType,
    secondOperand,
    filterValue: filter,
    filterType: !!filter && filter.length ? "index" : null,
    sort,
    pagesize,
    pageno,
  };
  const { tableHeaderData, tableData, pageSummary, payload } =
    await getCustomViewTable(bodyParams, isprimeuser, ssoid, "movingAverages");

  const selectedFilter = await getSelectedFilter(intFilter);
  const technicalCategory = await getTechincalOperands(
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
      <MarketStats
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
