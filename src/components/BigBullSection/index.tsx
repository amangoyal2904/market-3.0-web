import styles from "./styles.module.scss";
import BigBullCard from "./BigBullCard";
import ViewAllCardModule from "./BigBullCard/ViewAllCardModule";

const BigBullSection = ({
  data,
  pageSummaryInfo = [],
  title = "",
  type = "",
  mode = "",
}: any) => {
  console.log({ data, pageSummaryInfo });
  return (
    <>
      <div className={styles.mainCardSec}>
        <h3 className={styles.head3}>{title}</h3>
        <div className={styles.cartHolder}>
          {data && data.length > 0
            ? data.map((card: any, index: number) => {
                return (
                  <BigBullCard
                    key={`${index}-card`}
                    data={card}
                    type={type}
                    mode={mode}
                  />
                );
              })
            : "No data"}
          <ViewAllCardModule />
        </div>
      </div>
    </>
  );
};

export default BigBullSection;
