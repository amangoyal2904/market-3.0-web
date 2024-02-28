"use client";

import styles from "./styles.module.scss";
import StockFilterNifty from "../StockFilterNifty/index";
import { useEffect, useState } from "react";

const Subhead = (props: any) => {
  const { showIndexFilter } = props;
  const [showFilter, setShowFilter] = useState(false);
  const [filterMenuData, setFilterMenuData]: any = useState("");

  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleChagneData = (id: any, name: string, slectedTab: string) => {
    setShowFilter(false);
    sessionStorage.setItem("sr_filtervalue", id);
    sessionStorage.setItem("sr_filtername", name);
    sessionStorage.setItem("sr_filtertab", slectedTab);
    //setFilterMenuTxtShow({ name: name, id: id, slectedTab: slectedTab });
    //filterDataChange(id, name, slectedTab);
  };
  const filterApiCall = () => {
    try {
      fetch(
        "https://economictimes.indiatimes.com/feed/feed_indexfilterdata.cms?feedtype=etjson",
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            console.log("error filer data is not fetch");
          }
        })
        .then((data) => {
          setFilterMenuData(data);
        })
        .catch((err) => {
          console.log("get error", err);
        });
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    if (showIndexFilter) {
      filterApiCall();
    }
  }, []);

  return (
    <>
      <div className={styles.subHead}>
        <div className={styles.headName}>Most Buys</div>
        <div className={styles.actionBarWrap}>
          <div className={styles.sortByWrap}>
            <span className={styles.sortByText}>Sort By:</span>
            <select className={styles.sortByDD}>
              <option>Performance High to Low</option>
              <option>Performance Low to High</option>
            </select>
          </div>
          <div onClick={handleShowFilter} className={styles.niftyWrap}>
            <div className={styles.niftyBtn}>
              <span className="eticon_filter"></span>
              <span>Nifty 50</span>
            </div>
          </div>
          <div className={styles.listingTypeWrap}>
            <ul className={styles.listingType}>
              <li className={styles.active}>
                <span className="eticon_grid_view"></span>
              </li>
              <li>
                <span className="eticon_list_view"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* {showFilter && (
        <StockFilterNifty
          data={filterMenuData}
          onclick={""}
          showFilter={showFilter}
          valuechange={handleChagneData}
          selectTab={""}
          childMenuTabActive={""}
        />
      )} */}
    </>
  );
};

export default Subhead;
