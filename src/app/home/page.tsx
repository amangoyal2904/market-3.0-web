"use client";

import StockRecommendations from "@/components/StockRecommendations";
import WatchlistWidget from "@/components/WatchlistWidget";

const Home = () => {
  return (
    <>
      <WatchlistWidget />
      <StockRecommendations />
    </>
  );
};

export default Home;
