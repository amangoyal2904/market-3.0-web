"use client";
import React from "react";
import styles from "./styles.module.scss";

const SubscribeBtn = ({ text, planPageRedirect }: any) => {
  return (
    <>
      <span onClick={planPageRedirect} className={styles.subBtn}>
        {text}
      </span>
    </>
  );
};

export default SubscribeBtn;
