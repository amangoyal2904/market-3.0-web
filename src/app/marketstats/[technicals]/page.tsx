import useMarketStatsNav from "../useMarketStatsNav";
import useTechnicalTab from "../useTechnicalTab";
import useTechnicalTable from "../useTechnicalTable";
import Marketstats from "../marketstats";
import tableConfig from "@/utils/tableConfig.json";
import tabConfig from "@/utils/tabConfig.json";
import useSelectedFilter from "../useSelectedFilter";

const MovingAverages = async ({ searchParams }: any) => {
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

  const { tabData, activeViewId } = await useTechnicalTab({ type });
  const { tableHeaderData, tableData, ivKey } = await useTechnicalTable({
    activeViewId,
    filter,
    firstOperand,
    operationType,
    secondOperand,
    sort,
    pagesize,
    pageno,
  });

  const selectedFilter = await useSelectedFilter(intFilter);

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
        tableConfig={tableConfig["marketStatsTechnical"]}
        tabConfig={tabConfig["marketStatsTechnical"]}
      />
    </>
  );
};

export default MovingAverages;
