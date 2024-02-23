"use client";

import { useState } from "react";
import TabsMenuComponents from "./TabsTopMenu/TabsMenu";
import TabFiltersItemList from "./TabFiltersItem/TabFiltersListItem";
import QueryComponets from "./QueryComponets";

const RightSideTabTableComponent = ({ data, tabData }: any) => {
  const TableDataList = data.dataList;
  const TableScreenerDetail = data.screenerDetail;
  const TableRequestObj = data.requestObj;
  const [tabsData, setTabsData] = useState(tabData);
  const [niftyFilterData, setNiftyFilterData] = useState({
    name: "nifty50",
    id: 2350,
    slectedTab: "nse",
  });
  const activeViewId = "";
  const tabsUpdateHandler = () => {
    console.log("yes tab updat ehandler done click ");
  };
  const filterDataChangeHander = async (
    id: any,
    name: any,
    slectedTab: any,
  ) => {
    setNiftyFilterData({
      name,
      id,
      slectedTab,
    });

    // const url = `${pathname}?${searchParams}`;
    // let newUrl = "";
    // if (id !== 0) {
    //   const newDuration = id.toLowerCase();
    //   newUrl = url.replace(/filter=[^&]*/, "filter=" + newDuration);
    // } else {
    //   newUrl = url.replace(/filter=[^&]*/, "filter=" + 0);
    //   //newUrl = url.replace(/&?filter=[^&]*/, '');
    // }
    // router.push(newUrl, { scroll: false });
  };
  return (
    <>
      <div className="tabsWrap">
        <TabsMenuComponents data={tabsData} activeMenu={activeViewId} />
        <TabFiltersItemList
          personalize={true}
          exportIcon={true}
          createScreener={true}
          niftyFitler={true}
          data={tabsData}
          tabsUpdateHandler={tabsUpdateHandler}
          filterDataChange={filterDataChangeHander}
          niftyFilterData={niftyFilterData}
        />
      </div>
      <div>
        Here <br /> Table <br />
        show
      </div>
      <QueryComponets data={TableScreenerDetail} />
    </>
  );
};

export default RightSideTabTableComponent;
