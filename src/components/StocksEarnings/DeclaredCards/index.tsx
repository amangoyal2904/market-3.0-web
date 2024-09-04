import styles from "./styles.module.scss";
import Card from "./Card";
import NoDataCard from "./NoDataCard";
import ViewAllCta from "../ViewAllCta";
import Loader from "@/components/Loader";

const DeclaredCards = ({
  data,
  loading,
  typeMode = "",
  showViewAll = "yes",
}: any) => {
  const _title = `No Results have been declared for this quarter. Kindly check the upcoming result list.`;

  const cardData = data?.declaredCompanies || [];
  //console.log("___dacardDatata",cardData)
  return (
    <>
      <div className={styles.declaredWrap}>
        {loading ? (
          <Loader loaderType="container" />
        ) : (
          <>
            {cardData && cardData.length > 0 ? (
              cardData.map((item: any, index: number) => {
                return <Card key={`data-${index}-`} cardData={item} />;
              })
            ) : (
              <NoDataCard title={_title} />
            )}
          </>
        )}
      </div>
      {showViewAll === "yes" ? (
        <>
          {typeMode === "watchlist" ? (
            <ViewAllCta
              text="View all Results"
              urlInternal="yes"
              url="/markets/stocks/upcoming-results"
            />
          ) : cardData && cardData.length > 0 ? (
            <ViewAllCta
              text="View all Declared Results"
              urlInternal="yes"
              url="/markets/stocks/declared-results"
            />
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default DeclaredCards;
