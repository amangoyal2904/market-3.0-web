"use client";
import React, { useState, useEffect } from "react";
import StockRecommendations from "@/components/StockRecommendations";
import WatchlistWidget from "@/components/WatchlistWidget";
import StockReportsPlus from "@/components/StockReportsPlus";

const Home = () => {
  return (
    <>
      <WatchlistWidget />
      <StockRecommendations />
      <StockReportsPlus />
    </>
  );
};

export default Home;
