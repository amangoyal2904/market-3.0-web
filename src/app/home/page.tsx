"use client";

import MarketsDashboardWidget from "@/components/MarketsDashboardWidget";
import StockRecommendations from "@/components/StockRecommendations";
import WatchlistWidget from "@/components/WatchlistWidget";
import StockReportsPlus from "@/components/StockReportsPlus";

const Home = () => {
  return (
    <>
      <MarketsDashboardWidget />
      <WatchlistWidget />
      <StockRecommendations />
      <StockReportsPlus />
    </>
  );
};

export default Home;
