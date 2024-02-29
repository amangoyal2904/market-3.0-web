"use client";

import MarketsDashboardWidget from "@/components/MarketsDashboardWidget";
import StockRecommendations from "@/components/StockRecommendations";
import WatchlistWidget from "@/components/WatchlistWidget";
import StockReportsPlus from "@/components/StockReportsPlus";
import StockScreenerWidget from "@/components/ScreenerWidget";
import LiveStreamWidget from "@/components/LiveStreamWidget";

const Home = () => {
  return (
    <>
      <MarketsDashboardWidget />
      <WatchlistWidget />
      <StockRecommendations />
      <StockReportsPlus />
      <StockScreenerWidget />
      <LiveStreamWidget />
    </>
  );
};

export default Home;
