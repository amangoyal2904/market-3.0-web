import styles from "./styles.module.scss";
import SummaryCard from "./SummaryCard";

const TopSummaryCards = ({ data }: any) => {
  const declaredData = data?.declaredData || "";
  const yoyData = data?.yoyData || "";
  const qoqData = data?.qoqData || "";
  const topPerformingSectors = data?.topPerformingSectors || "";
  const underPerformingSectors = data?.underPerformingSectors || "";
  return (
    <>
      <div className={styles.topSummaryWrap}>
        {declaredData !== "" && (
          <SummaryCard data={declaredData} type="declaredData" />
        )}
        {yoyData !== "" && <SummaryCard data={yoyData} type="yoyData" />}
        {qoqData !== "" && <SummaryCard data={qoqData} type="qoqData" />}
        {topPerformingSectors !== "" && (
          <SummaryCard
            data={topPerformingSectors}
            type="topPerformingSectors"
          />
        )}
        {underPerformingSectors !== "" && (
          <SummaryCard
            data={underPerformingSectors}
            type="underPerformingSectors"
          />
        )}
      </div>
    </>
  );
};

export default TopSummaryCards;
