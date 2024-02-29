"use client";
import React, { useState } from "react";
import styles from "./Blocker.module.scss";
import { initSSOWidget } from "../../utils";
import GLOBAL_CONFIG from "../../network/global_config.json";
import AddStockComponent from "../StockAdd";

interface propsType {
  type: any;
  updateTableHander?: any;
}

const handleLoginToggle = (): void => {
  initSSOWidget();
};

const blockerList: any = {
  loginBlocker: {
    message: "To access watchlist data please login here",
    cta: "Login",
    action: handleLoginToggle,
    icon: 107522568,
  },
  noDataFound: {
    message:
      "No record found for search criteria, please check our other stats!",
    cta: "",
    action: "",
    icon: 107522565,
  },
  noStocks: {
    message: "You have not added any Stocks to your Watchlist",
    cta: "Add Stocks",
    action: "",
    icon: 107522570,
  },
  notFound: {
    message: "Page not Found!",
    cta: "",
    action: "",
    icon: 107522565,
  },
};
const Blocker = (props: propsType) => {
  const [addStockShow, setAddStockShow] = useState(false);
  const { type, updateTableHander } = props;
  const { message, cta, action, icon } = blockerList[type] || {};

  const moduelClose = () => {
    setAddStockShow(false);
  };

  const handleAddStocks = () => {
    setAddStockShow(true);
  };

  return (
    <>
      <div className={styles.blockerContainer}>
        {icon && (
          <img
            width={150}
            height={150}
            src={(GLOBAL_CONFIG as any).ET_IMG_DOMAIN + `/photo/${icon}.cms`}
          />
        )}
        {message && <p>{message}</p>}
        {cta && (
          <button onClick={cta == "Add Stocks" ? handleAddStocks : action}>
            {cta}
          </button>
        )}
      </div>
      {addStockShow ? (
        <AddStockComponent
          moduelClose={setAddStockShow}
          updateTableHander={updateTableHander}
        />
      ) : null}
    </>
  );
};
export default Blocker;
