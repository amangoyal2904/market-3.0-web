import styles from "./styles.module.scss";

export default function stocksrecos({
  params,
}: {
  params: {
    slug: string[];
  };
}) {
  console.log("params.slug", params.slug);
  return (
    <>
      <div className={styles.recosPageWrap}>
        <div className={styles.recosHeadWrap}>
          <h1 className={styles.hdg}>Stock Recommendations</h1>
          <p className={styles.desc}>
            Stocks with their SMA50 trading above their SMA200. Technical
            Screener whose SMA 50 recently crossed above their SMA 200. Commonly
            known as Golden Cross & important technical indicator for bullish
            stocks.
          </p>
        </div>
      </div>
    </>
  );
}
