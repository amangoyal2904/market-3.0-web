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
  activeResultValue = "",
}: any) => {
  //console.log("________",activeResultValue)
  const _title =
    activeResultValue === "latest-results"
      ? "No results have been declared for this quarter. Kindly check the upcoming results list or change any filters applied by you."
      : activeResultValue === "sales-gainers"
        ? "Out of declared results, no company has shown positive sales growth."
        : activeResultValue === "sales-losers"
          ? "Out of declared results, no company has shown negative sales growth"
          : activeResultValue === "profit-gainers"
            ? "Out of declared results, no company has shown positive profit growth"
            : activeResultValue === "profit-losers"
              ? "Out of declared results, no company has shown negative profit growth"
              : "No results have been declared for this quarter. Kindly check the upcoming results list or change any filters applied by you.";

  const cardData = data?.declaredCompanies || [];
  const viewAllTxt =
    activeResultValue === "latest-results"
      ? "View all Declared Results"
      : activeResultValue === "sales-gainers"
        ? "View all sales gainers Results"
        : activeResultValue === "sales-losers"
          ? "View all sales losers Results"
          : activeResultValue === "profit-gainers"
            ? "View all profit gainers Results"
            : activeResultValue === "profit-losers"
              ? "View all profit losers Results"
              : "View all Declared Results";

  const viewAllTxtLink =
    activeResultValue === "latest-results"
      ? "/markets/stocks/earnings/declared-results/latest"
      : activeResultValue === "sales-gainers"
        ? "/markets/stocks/earnings/declared-results/sales-gainers"
        : activeResultValue === "sales-losers"
          ? "/markets/stocks/earnings/declared-results/sales-losers"
          : activeResultValue === "profit-gainers"
            ? "/markets/stocks/earnings/declared-results/profit-gainers"
            : activeResultValue === "profit-losers"
              ? "/markets/stocks/earnings/declared-results/profit-losers"
              : "/markets/stocks/earnings/declared-results/latest";
  //console.log("___dacardDatata",cardData, activeResultValue)
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
              url="/markets/stocks/earnings/declared-results/latest"
            />
          ) : cardData && cardData.length > 0 ? (
            <ViewAllCta
              text={`${viewAllTxt}`}
              urlInternal="yes"
              url={`${viewAllTxtLink}`}
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
