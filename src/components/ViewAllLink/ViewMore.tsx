"use client";
import Link from "next/link";
import styles from "./ViewAll.module.scss";
import { ga4withlink } from "@/utils/ga";

const ViewMore = ({ text, link }: any) => {
  return (
    <a
      href="#"
      title={text}
      onClick={() => ga4withlink("page_cta_click", text, link)}
    >
      {text}
      <span className=" eticon_next" />
    </a>
  );
};
export default ViewMore;
