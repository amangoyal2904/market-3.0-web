import { fnGenerateMetaData } from "@/utils/utility";
import { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";
import styles from "./Investedge.module.scss";
import { useState } from "react";
import VideoEmbed from "@/components/VideoEmbed";
import InvestEdgeClient from "./client";
import Tabbing from "@/components/InvestmentIdea/Tabbing";

export async function generateMetadata(
  { searchParams }: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const meta = {
    title:
      "Share Market, Nifty, Sensex, NSE/BSE Live Updates, Stock Market Today",
    desc: "Curated videos on stocks, mutual funds, investment strategies & more to help you manage your wealth seamlessly.",
    keywords:
      "Share Market, Stock Market, share market live updates, NIFTY, Sensex Today live, NSE/BSE, big bull, stock reports, stock screeners, indices, market mood, forex, commodity, top investors",
    pathname: pageUrl,
    index: true,
  };
  return fnGenerateMetaData(meta);
}

const InvestEdge = () => {
  return (
    <>
      <h1 className={styles.title}>Invest Edge</h1>
      <p className={styles.desc}>
        Curated videos on stocks, mutual funds, investment strategies & more to
        help you manage your wealth seamlessly.
      </p>
      <Tabbing />
      <InvestEdgeClient />
    </>
  );
};

export default InvestEdge;
