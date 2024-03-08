"use client";
import InnerLeftNav from "./InnerLeftNav";
import Listing from "./Listing";
import Subhead from "./Subhead";
import styles from "./styles.module.scss";
import { useState } from "react";
import { getSelectedFilter } from "@/utils/utility";
import Grid from "./Grid";
const StockRecosListing = (props: any) => {
  const { recosNavResult, recosDetailResult, selectedFilter, data } = props;
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);

  console.log("StockRecosListing----", recosDetailResult);
  const filterDataChangeHander = async (id: any) => {
    //setProcessingLoader(true);
    // const url = `${pathname}?${searchParams}`;
    // const newUrl = updateOrAddParamToPath(url, "filter", id);
    const selectedFilter = await getSelectedFilter(id);
    setNiftyFilterData(selectedFilter);
    console.log("selectedFilter", selectedFilter);
    // setPayload({ ..._payload, filterValue: [id] });
    // updateL3NAV(id, _payload.duration);
    // router.push(newUrl, { scroll: false });
  };
  return (
    <>
      <Subhead
        showIndexFilter={true}
        niftyFilterData={niftyFilterData}
        filterDataChange={filterDataChangeHander}
      />
      <div className={styles.contentWrap}>
        {/* <InnerLeftNav recosNavResult={recosNavResult} /> */}
        {true ? (
          <Grid recosDetailResult={data} />
        ) : (
          <Listing recosDetailResult={recosDetailResult} />
        )}
      </div>
    </>
  );
};

export default StockRecosListing;
