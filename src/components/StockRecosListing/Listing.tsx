"use client";

import { usePathname } from "next/navigation";
import StockReco from "../StockReco";
import styles from "./styles.module.scss";
import Blocker from "../Blocker";

const Listing = (props: any) => {
  const { recosDetailResult, activeApi } = props;
  const pathname = usePathname();

  console.log("router----", recosDetailResult);
  return (
    <>
      {typeof recosDetailResult?.recoData?.[0].data != "undefined" ? (
        <div className={styles.listingWrap}>
          {recosDetailResult?.recoData?.[0].data.map(
            (recoDataValue: any, index: any) => {
              return (
                <StockReco
                  data={recoDataValue}
                  key={index}
                  activeTab={activeApi}
                  pageName="stockRecosPage"
                />
              );
            },
          )}
        </div>
      ) : (
        <div className={`${styles.listingWrap} ${styles.noDataFound}`}>
          <Blocker type={"noDataFound"} />
        </div>
      )}
    </>
  );
};

export default Listing;
