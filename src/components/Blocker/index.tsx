"use client";
import React, { useState } from "react";
import styles from "./Blocker.module.scss";
import { initSSOWidget } from "../../utils";
import GLOBAL_CONFIG from "../../network/global_config.json";
import AddStockComponent from "../StockAdd";
import { trackingEvent } from "@/utils/ga";
import { APP_ENV } from "@/utils/index";

interface propsType {
  type: any;
  updateTableHandler?: any;
  nodataFound?: any;
  customMessage?: string; // Add the customMessage prop
}

const handleLoginToggle = (): void => {
  initSSOWidget();
};

const blockerList: any = {
  watchlitFilterBlocker: {
    id: 1,
    message: "Please login to view stats based on your watchlist filter.",
    cta: "Login",
    action: handleLoginToggle,
    icon: 107522568,
  },
  loginBlocker: {
    id: 1,
    message:
      "Track your favorite stocks in one place. <br /> Login & manage your Watchlist.",
    cta: "Login",
    action: handleLoginToggle,
    icon: 107522568,
  },
  noDataFound: {
    id: 2,
    message:
      "No record found for search criteria, please check our other stats!",
    cta: "",
    action: "",
    icon: 107522565,
  },
  noStocks: {
    id: 3,
    message: "You've not added any stocks to your Watchlist yet.",
    cta: "Add Stocks Now",
    action: "",
    icon: 107522570,
  },
  notFound: {
    id: 4,
    message: "Page not Found!",
    cta: "",
    action: "",
    icon: 107522565,
  },
  noDataMinimal: {
    id: 5,
    message: "No Data Found",
    cta: "",
    action: "",
    icon: 107522570,
  },
  noRecentDeals: {
    id: 6,
    message: "No recent deals have been made by the investor",
    cta: "",
    action: "",
    icon: 107522565,
  },
  apiFailed: {
    id: 7,
    message: "Something Went Wrong!!",
    cta: "",
    action: "",
    icon: 107522570,
  },
};

const Blocker = (props: propsType) => {
  const [addStockShow, setAddStockShow] = useState(false);
  const { type, updateTableHandler, customMessage, nodataFound } = props;
  const { message, cta, action, icon, id } = blockerList[type] || {};

  const moduelClose = () => {
    setAddStockShow(false);
  };

  const handleAddStocks = () => {
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "page_cta_click",
      event_label: "add stock",
    });
    setAddStockShow(true);
  };

  return (
    <>
      <div className={styles.blockerContainer}>
        {icon && (
          <img
            width={150}
            height={150}
            alt={message}
            title={message}
            src={(GLOBAL_CONFIG as any).ET_IMG_DOMAIN + `/photo/${icon}.cms`}
            loading="lazy"
          />
        )}
        {customMessage ? (
          <div
            className={styles.customMessageWrapper} // You can apply your styles here
            dangerouslySetInnerHTML={{ __html: customMessage }}
          />
        ) : (
          message && (
            <p
              dangerouslySetInnerHTML={{
                __html: nodataFound !== "" ? nodataFound : message,
              }}
            />
          )
        )}
        {type == "notFound" && (
          <a
            className="linkUnderline"
            href={(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}
          >
            Go to Economictimes.com
          </a>
        )}
        {cta && (
          <button onClick={id == 3 ? handleAddStocks : action}>{cta}</button>
        )}
      </div>
      {addStockShow ? (
        <AddStockComponent
          moduelClose={setAddStockShow}
          updateTableHandler={updateTableHandler}
        />
      ) : null}
    </>
  );
};
export default Blocker;
