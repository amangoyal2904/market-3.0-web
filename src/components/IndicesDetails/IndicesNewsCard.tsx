import { dateFormat } from "@/utils";
import styles from "./IndicesDetails.module.scss";
import React from "react";
const IndicesNewsCard = React.memo(({ data }: any) => {
  const updateURLDimensions = (url: string) => {
    if (!!url) {
      const regexWidth = /width=\d+/;
      const regexHeight = /height=\d+/;
      const replacement = `width=66&height=55`;
      let newUrl = url;

      // Replace width
      if (regexWidth.test(url)) {
        newUrl = newUrl.replace(regexWidth, "width=66");
      } else {
        newUrl += (newUrl.includes("?") ? "&" : "?") + "width=66";
      }

      // Replace height
      if (regexHeight.test(url)) {
        newUrl = newUrl.replace(regexHeight, "height=55");
      } else {
        newUrl += "&height=55";
      }

      return "https://img.etimg.com" + newUrl;
    } else {
      return "https://img.etimg.com/thumb.cms?photoid=42031747&imgsize=&width=66&height=55&resizemode=4";
    }
  };
  return (
    <a
      className={styles.newsCard}
      href={data.wu}
      target="_blank"
      title={data.hl}
    >
      <div className={styles.content}>
        <p className={styles.headline}>{data.hl}</p>
        <span>{dateFormat(data.da, "%d %MMM, %Y")}</span>
      </div>
      <img
        src={updateURLDimensions(data.im)}
        width={66}
        height={55}
        alt={data.hl}
        loading="lazy"
      />
    </a>
  );
});
IndicesNewsCard.displayName = "IndicesNewsCard";
export default IndicesNewsCard;
