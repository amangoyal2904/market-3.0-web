import Blocker from "@/components/Blocker";
import React from "react";

const NotFound = () => {
  return (
    <>
      <Blocker type="notFound" />

      <h1 className="dflex align-item-center center p20">
        Explore below pages meanwhile
      </h1>
      <div className="dflex align-item-center center p20">
        <a href="/watchlist" className="default-btn">
          Watchlist
        </a>
        <a className="default-btn" href="/stocks/marketstats/top-gainers">
          Marketstats Intraday
        </a>
        <a className="default-btn" href="/markets">
          Markets
        </a>
        <a className="default-btn" href="/markets/stock-screener">
          Stock Screener
        </a>
      </div>
    </>
  );
};

export default NotFound;
