"use client";
import React, { Fragment, useState } from "react";
import styles from "./Footer.module.scss";

interface Props {
  title: string;
  data: any;
}

const FooterList: React.FC<Props> = ({ title, data }) => {
  const [text, setText] = useState("MORE");
  //console.log("FooterlIst title--->", title);
  const showMore = (e: any) => {
    e.stopPropagation();
    const elm = e.currentTarget;
    if (elm.classList.contains(styles["collapsed"])) {
      elm.classList.remove(styles["collapsed"]);
      elm.classList.add(styles["expanded"]);
      setText("MORE");
      const caret = elm.getElementsByClassName(styles["caret"]);
      caret[0].classList.remove("eticon_caret_up");
      caret[0].classList.add("eticon_caret_down");
    } else {
      elm.classList.remove(styles["expanded"]);
      elm.classList.add(styles["collapsed"]);
      setText("LESS");
      const caret = elm.getElementsByClassName(styles["caret"]);
      caret[0].classList.remove("eticon_caret_down");
      caret[0].classList.add("eticon_caret_up");
    }
  };
  return (
    <>
      <div
        className={`${styles.footerList} ${text == "LESS" ? styles["visible"] : ""}`}
      >
        <h3>{title}</h3>
        <div
          className={`${styles.toggleLinks} ${styles.expanded}`}
          onClick={(e) => showMore(e)}
        >
          {text} <span className={`${styles.caret} eticon_caret_down`}></span>
        </div>
        <div className={styles.footerLinks}>
          {data &&
            data.length > 0 &&
            data.map((item: any, index: number) => {
              return (
                <Fragment key={`footer_${index}`}>
                  <a
                    target="_blank"
                    title={item.title}
                    href={item.url}
                    key={index}
                  >
                    {item.title}
                  </a>
                </Fragment>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default FooterList;
