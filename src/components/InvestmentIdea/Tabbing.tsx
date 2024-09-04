"use client";
import Link from "next/link";
import styles from "./InvestmentIdea.module.scss";

export const Tabbing = () => {
  return (
    <>
      <div className={styles.tabHeader}>
        <ul>
          <li>Stock Markets</li>
          <li>Mutual Funds</li>
          <li>Investment Styles</li>
          <li>Insurance & Wealth Management</li>
          <li>Live Stream</li>
        </ul>
      </div>
    </>
  );
};

export default Tabbing;
