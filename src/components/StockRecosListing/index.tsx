"use client";
import InnerLeftNav from "./InnerLeftNav";
import Listing from "./Listing";
import Subhead from "./Subhead";
import styles from "./styles.module.scss";

const StockRecosListing = (props: any) => {
  const { recosNavResult, recosDetailResult } = props;

  console.log("StockRecosListing----", recosDetailResult);

  return (
    <>
      <Subhead showIndexFilter={true} />
      <div className={styles.contentWrap}>
        <InnerLeftNav recosNavResult={recosNavResult} />
        <Listing recosDetailResult={recosDetailResult} />
      </div>
    </>
  );
};

export default StockRecosListing;
