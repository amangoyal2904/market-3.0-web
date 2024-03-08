import InnerLeftNav from "./InnerLeftNav";
import Listing from "./Listing";
import styles from "./styles.module.scss";

const StockRecosListing = (props: any) => {
  const { recosNavResult, recosDetailResult, activeApi, slug } = props;

  console.log("StockRecosListing --- ", slug);

  return (
    <>
      <div className={styles.contentWrap}>
        {/* {
          (activeApi == "newRecos" || slug.includes("fundhousedetails")) && <InnerLeftNav recosNavResult={recosNavResult} recosDetailResult={recosDetailResult} activeApi={activeApi} slug={slug} />
        } */}
        <Listing recosDetailResult={recosDetailResult} activeApi={activeApi} />
      </div>
    </>
  );
};

export default StockRecosListing;
