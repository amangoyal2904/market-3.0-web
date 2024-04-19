"use client";
import { useState } from "react";
import Link from "next/link";
import { fetchSelectedFilter } from "@/utils/utility";

const BigBullMostHeldClientPage = ({ data, selectedFilter }: any) => {
  console.log("___data", data, selectedFilter);
  const [tabName, setTabName] = useState("overview");
  const [niftyFilterData, setNiftyFilterData] = useState(selectedFilter);
  const tabHandlerClick = (id: string) => {
    setTabName(id);
  };
  const filterDataChangeHander = async (id: any) => {
    const filter =
      id !== undefined && !isNaN(Number(id))
        ? parseInt(id)
        : id !== undefined
          ? id
          : 0;
    const selectedFilter = await fetchSelectedFilter(filter);
    setNiftyFilterData(selectedFilter);
  };
  return <>BigBullMostHeldClientPage</>;
};

export default BigBullMostHeldClientPage;
