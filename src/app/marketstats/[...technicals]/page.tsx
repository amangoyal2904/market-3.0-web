import useMarketStatsNav from "../useMarketStatsNav";
import useTechnicalTab from "../useTechnicalTab";
import useTechnicalTable from "../useTechnicalTable";
import Marketstats from "../marketstats";
import tableConfig from "@/utils/tableConfig.json";
import tabConfig from "@/utils/tabConfig.json";
import useSelectedFilter from "../useSelectedFilter";
import useTechnicalFilters from "../useTechnicalFilters";
import { cookies } from "next/headers";

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
    type,
    ssoid,
  });

  const { tableHeaderData, tableData, ivKey, payload } =
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
  return (
    <>
      <Marketstats
        l3Nav={l3Nav}
        metaData={metaData[0]}
        tabData={tabData}
        activeViewId={activeViewId}
        tableHeaderData={tableHeaderData}
        tableData={tableData}
        ivKey={ivKey}
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
