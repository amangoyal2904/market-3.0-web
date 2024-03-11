"use client";
import { useState } from "react";
import Grid from "./Grid";
import InnerLeftNav from "./InnerLeftNav";
import Listing from "./Listing";
import Subhead from "./Subhead";
import styles from "./styles.module.scss";
import Overview from "./Overviews";

const StockRecosListing = (props: any) => {
  const {
    recosNavResult,
    recosDetailResult,
    activeApi,
    slug,
    selectedFilter,
    activeTab,
  } = props;
  const [activeItem, setActiveItem] = useState("listytpe_card");

  console.log("StockRecosListing --- ", slug);

  const handleSetActiveItem = (key: any) => {
    setActiveItem(key);
  };

  return (
    <>
      <Subhead
        showIndexFilter={true}
        selectedFilter={selectedFilter}
        recosNavResult={recosNavResult}
        activeTab={slug?.[0]}
        slug={slug}
        activeItem={activeItem}
        setActiveItem={handleSetActiveItem}
      />
      <div
        className={`${styles.contentWrap} ${slug?.[0] == "overview" ? styles.overviewWrap : ""}`}
      >
        {/* {
          (activeApi == "newRecos" || slug.includes("fundhousedetails")) && <InnerLeftNav recosNavResult={recosNavResult} recosDetailResult={recosDetailResult} activeApi={activeApi} slug={slug} />
        } */}

        {slug?.[0] == "overview" ? (
          <Overview data={recosDetailResult} />
        ) : activeItem == "listytpe_table" ? (
          <Grid recosDetailResult={recosDetailResult} activeApi={activeApi} />
        ) : (
          <Listing
            recosDetailResult={recosDetailResult}
            activeApi={activeApi}
          />
        )}
      </div>
    </>
  );
};

export default StockRecosListing;
