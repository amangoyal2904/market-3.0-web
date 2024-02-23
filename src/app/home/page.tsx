"use client";

import MarketsDashboardWidget from "@/components/MarketsDashboardWidget";
import StockRecommendations from "@/components/StockRecommendations";
import WatchlistWidget from "@/components/WatchlistWidget";

const Home = () => {
  return (
    <>
      <MarketsDashboardWidget />
      <WatchlistWidget />
      <StockRecommendations />
    </>
  );
};

export default Home;
