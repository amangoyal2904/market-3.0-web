"use client";

import Link from "next/link";
import styles from "./styles.module.scss";
import React, { useEffect, useState } from "react";

const FundNavAccordionItem = ({
  item,
  slug,
  getFundHouseInfo,
  urlFilterHandle,
}: any) => {
  const [isOpen, setIsOpen] = useState(getFundHouseInfo.isOpenTab);

  const filterList = ["All", "Buy", "Sell", "Hold"];

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const fundHouseSeoName = (item: any) => {
    return item?.toLowerCase().replace(/ /g, "-");
  };

  //getFundHouseDetailFromURL()

  return (
    <>
      <li className={styles.fundHousesLeftNav}>
        <div className={styles.navTitle} onClick={toggleAccordion}>
          <span
            className={`${isOpen ? "eticon_caret_up" : "eticon_caret_down"} ${styles.arrowIcon}`}
          ></span>
          <span className={styles.organisationNavName}>
            {item.organisation}
          </span>
        </div>
        {isOpen && (
          <ul className={styles.fundFilterWrap}>
            {filterList.map((filter: any, index: any) => {
              return (
                <li
                  key={`fundnav_filterList_${index}`}
                  className={`${fundHouseSeoName(getFundHouseInfo.fundHounseName) == fundHouseSeoName(item.organisation) && slug?.[2] == fundHouseSeoName(filter) ? styles.active : ""} ${styles.fundFilter}`}
                >
                  <Link
                    href={`/stocksrecos/fundhousedetails/${fundHouseSeoName(item.organisation)}-${item.omId}/${fundHouseSeoName(filter)}${urlFilterHandle()}`}
                  >
                    {filter}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    </>
  );
};

export default FundNavAccordionItem;
