import styles from "../Marketstats.module.scss";
import useMarketStatsNav from "../useMarketStatsNav";
import useTechnicalTab from "../useTechnicalTab";
import useTechnicalTable from "../useTechnicalTable";
import Marketstats from "../marketstats";

const MovingAverages = async ({ searchParams }: any) => {
  const type = searchParams?.type;
  const filter = searchParams.filter ? [parseInt(searchParams.filter)] : [];

  const { l3Nav, metaData } = await useMarketStatsNav({
    type,
    filter,
  });
  const { tabData, activeViewId } = await useTechnicalTab({
    type,
  });
  const pageType = "techcnials";
  const { tableHeaderData, tableData, ivKey } = await useTechnicalTable({
    activeViewId,
    pageType,
    searchParams,
  });

  return (
    <>
      <h1 className={styles.heading}>{metaData[0].title}</h1>
      <p className={styles.desc}>{metaData[0].desc}</p>
      <Marketstats
        l3Nav={l3Nav}
        tabData={tabData}
        activeViewId={activeViewId}
        tableHeaderData={tableHeaderData}
        tableData={tableData}
        ivKey={ivKey}
      />
    </>
  );
};

export default MovingAverages;
