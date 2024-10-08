import styles from "./styles.module.scss";
import SummaryCard from "./SummaryCard";

const TopSummaryCards = ({ data }: any) => {
  const declaredData = data?.declaredData || {};
  const yoyData = data?.yoyData || {};
  const qoqData = data?.qoqData || {};
  const topPerformingSectors = data?.topPerformingSectors || {};
  const underPerformingSectors = data?.underPerformingSectors || {};
  return (
    <>
      <div className={styles.topSummaryWrap}>
        <SummaryCard data={declaredData} type="declaredData" />
        <SummaryCard data={yoyData} type="yoyData" />
        <SummaryCard data={qoqData} type="qoqData" />
        <SummaryCard data={topPerformingSectors} type="topPerformingSectors" />
        <SummaryCard
          data={underPerformingSectors}
          type="underPerformingSectors"
        />
      </div>
    </>
  );
};

export default TopSummaryCards;
