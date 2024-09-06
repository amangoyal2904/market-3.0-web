import styles from "./styles.module.scss";

const Table7DGraph = ({ data }: any) => {
  const maxVolume =
    data && data.length > 0
      ? Math.max(...data.map((item: any) => item.volume))
      : 0;
  //console.log({data, maxVolume})
  if (!data || data === "" || data.length < 3) {
    return "-";
  }
  return (
    <>
      <div className={styles.graphWrap}>
        {data && data.length > 0
          ? data.map((item: any, index: number) => {
              const barHeight = (item.volume / maxVolume) * 100;
              return (
                <span
                  className={styles.graphSpan}
                  key={`--${index}-he`}
                  style={{ height: `${barHeight}%` }}
                ></span>
              );
            })
          : ""}
      </div>
    </>
  );
};
export default Table7DGraph;
