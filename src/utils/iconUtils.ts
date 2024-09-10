// utilities/iconUtils.ts
import React from "react";

export const renderIconPaths = (icon: string) => {
  const iconPaths: { [key: string]: React.ReactElement[] } = {
    eticon_news: [
      React.createElement("span", { key: "1", className: "path1" }),
      React.createElement("span", { key: "2", className: "path2" }),
      React.createElement("span", { key: "3", className: "path3" }),
      React.createElement("span", { key: "4", className: "path4" }),
      React.createElement("span", { key: "5", className: "path5" }),
      React.createElement("span", { key: "6", className: "path6" }),
      React.createElement("span", { key: "7", className: "path7" }),
    ],
    eticon_watchlist: [
      React.createElement("span", { key: "1", className: "path1" }),
      React.createElement("span", { key: "2", className: "path2" }),
    ],
    eticon_marketmood: [
      React.createElement("span", { key: "1", className: "path1" }),
      React.createElement("span", { key: "2", className: "path2" }),
      React.createElement("span", { key: "3", className: "path3" }),
      React.createElement("span", { key: "4", className: "path4" }),
      React.createElement("span", { key: "5", className: "path5" }),
      React.createElement("span", { key: "6", className: "path6" }),
      React.createElement("span", { key: "7", className: "path7" }),
    ],
    eticon_epaper_icon: [
      React.createElement("span", { key: "1", className: "path1" }),
      React.createElement("span", { key: "2", className: "path2" }),
    ],
    eticon_recos: [
      React.createElement("span", { key: "1", className: "path1" }),
      React.createElement("span", { key: "2", className: "path2" }),
      React.createElement("span", { key: "3", className: "path3" }),
      React.createElement("span", { key: "4", className: "path4" }),
      React.createElement("span", { key: "5", className: "path5" }),
      React.createElement("span", { key: "6", className: "path6" }),
      React.createElement("span", { key: "7", className: "path7" }),
      React.createElement("span", { key: "8", className: "path8" }),
      React.createElement("span", { key: "9", className: "path9" }),
      React.createElement("span", { key: "10", className: "path10" }),
      React.createElement("span", { key: "11", className: "path11" }),
    ],
    eticon_prime_logo: [
      React.createElement("span", { key: "1", className: "path1" }),
      React.createElement("span", { key: "2", className: "path2" }),
      React.createElement("span", { key: "3", className: "path3" }),
    ],
  };

  return iconPaths[icon] || null;
};
