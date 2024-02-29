//"use client";
import APIS_CONFIG from "../../network/api_config.json";
import StockRecommendations from "@/components/StockRecommendations";
import service from "@/network/service";
import { APP_ENV } from "@/utils";
import { useEffect } from "react";

const Home = async () => {
  const leftNavApi =
    "https://etmarketsapis.indiatimes.com/ET_Stats/getRecosDetail";
  const payload = {
    apiType: "newRecos",
    filterType: "",
    filterValue: [],
    recoType: "all",
    pageSize: 100,
    pageNumber: 1,
  };
  const headers = {
    "Content-Type": "application/json",
  };
  const leftNavPromise = await service.post({
    url: leftNavApi,
    headers: headers,
    body: JSON.stringify(payload),
    params: {},
  });
  const leftNavResult123 = await leftNavPromise?.json();
  console.log("leftNavResult345", leftNavResult123);

  return (
    <>
      <StockRecommendations />
    </>
  );
};

export default Home;
