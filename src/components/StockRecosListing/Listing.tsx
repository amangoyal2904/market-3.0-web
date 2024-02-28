"use client";

import { usePathname } from "next/navigation";
import StockReco from "../StockReco";
import styles from "./styles.module.scss";

const Listing = (props: any) => {
  const { recosDetailResult } = props;
  const pathname = usePathname();

  console.log("router----", recosDetailResult);
  return (
    <>
      <div className={styles.listingWrap}>
        {recosDetailResult?.recoData.map((recoDataValue: any, index: any) => {
          return recoDataValue?.data.map((value: any, index: any) => {
            // console.log("recoData---", value)
            return <StockReco data={value} key={index} activeTab="newRecos" />;
          });
        })}
      </div>
    </>
  );
};

export default Listing;
