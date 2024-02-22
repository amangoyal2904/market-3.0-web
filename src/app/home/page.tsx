"use client";
import React, { useState, useEffect } from "react";
import StockRecommendations from "@/components/StockRecommendations";
import StockReportsPlus from "@/components/StockReportsPlus";

const Home = () => {
  return (
    <>
      <StockRecommendations />
      <StockReportsPlus />
    </>
  );
};

export default Home;
