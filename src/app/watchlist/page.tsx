import { Metadata } from "next";
import WatchListClient from "./client";

export const metadata: Metadata = {
  title: "Watchlist",
  description:
    "My Watchlist: Check you stocks last & recent price on The ET Markets. Get all the latest information about your stocks, prev. close, stocks price change, stocks percentage change, low & High stocks and more.",
};

const MyWatchList = async () => {
  return (
    <>
      <WatchListClient />
    </>
  );
};

export default MyWatchList;
