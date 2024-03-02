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
  const L3NavMenuItem = params.technicals[0];
  const L3NavSubItem = searchParams?.type?.toLowerCase();
  const firstOperand = searchParams?.firstoperand;
  const operationType = searchParams?.operationtype;
  const secondOperand = searchParams?.secondoperand;
  const intFilter = searchParams.filter ? parseInt(searchParams.filter) : 0;

  const { metaData } = await getMarketStatsNav({ L3NavSubItem, intFilter });

  const technicalCategory = await getTechincalOperands(
    L3NavMenuItem,
    L3NavSubItem,
    firstOperand,
    operationType,
    secondOperand,
  );
  const title = metaData[0]?.title;
  const desc = `Discover the stocks in the Indian stock market with ${technicalCategory?.selectedFilterLabel?.firstOperand} ${technicalCategory?.selectedFilterLabel?.operationType} ${technicalCategory?.selectedFilterLabel?.secondOperand} exclusively on The Economic Times`;
  const meta = {
    title: title,
    desc: desc,
    keywords: `et, etmarkets, economictimes, ${L3NavMenuItem}, ${L3NavSubItem}, ${firstOperand}, ${operationType}, ${secondOperand}`,
    index: false,
  };
  return fnGenerateMetaData(meta);
}

const MovingAverages = async ({ searchParams, params }: any) => {
  const cookieStore = cookies();
  const isprimeuser = cookieStore.get("isprimeuser") ? true : false;
  const L3NavMenuItem = params.technicals[0];
  const L3NavSubItem = searchParams?.type?.toLowerCase();
  const ssoid = cookieStore.get("ssoid")?.value;
  const intFilter = searchParams.filter ? parseInt(searchParams.filter) : 0;
  const filter = !!intFilter ? [intFilter] : [];
  const firstOperand = searchParams?.firstoperand;
  const operationType = searchParams?.operationtype;
  const secondOperand = searchParams?.secondoperand;
  const pagesize = 100;
  const pageno = 1;
  const sort: any = [];

  const { l3Nav, metaData } = await getMarketStatsNav({
    L3NavSubItem,
    intFilter,
  });

  const { tabData, activeViewId } = await getCustomViewsTab({
    firstOperand,
    operationType,
    secondOperand,
    ssoid,
  });

  const bodyParams = {
    viewId: activeViewId,
    apiType: L3NavSubItem,
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
    L3NavMenuItem,
    L3NavSubItem,
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
        l3NavMenuItem={L3NavMenuItem}
        l3NavSubItem={L3NavSubItem}
      />
    </>
  );
};

export default MovingAverages;
