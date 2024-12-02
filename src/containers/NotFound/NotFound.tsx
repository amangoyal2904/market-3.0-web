import Blocker from "@/components/Blocker";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <>
      <Blocker type="notFound" />

      <h1 className="dflex align-item-center center p20">
        Explore below pages meanwhile
      </h1>
      <div className="dflex align-item-center center p20">
        <Link href="/watchlist" className="default-btn">
          Watchlist
        </Link>
        <Link className="default-btn" href="/stocks/marketstats/top-gainers">
          Marketstats Intraday
        </Link>
        <Link className="default-btn" href="/markets">
          Markets
        </Link>
        <Link className="default-btn" href="/markets/stock-screener">
          Stock Screener
        </Link>
      </div>
    </>
  );
};

export default NotFound;
