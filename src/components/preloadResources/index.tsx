"use client";

import ReactDOM from "react-dom";

export function PreloadResources() {
  ReactDOM.prefetchDNS("https://securepubads.g.doubleclick.net");
  ReactDOM.prefetchDNS("https://sb.scorecardresearch.com");
  ReactDOM.prefetchDNS("https://static.clmbtech.com");
  ReactDOM.prefetchDNS("https://googletagmanager.com");
  ReactDOM.prefetchDNS("https://gstatic.com");
  ReactDOM.prefetchDNS("https://fonts.googleapis.com");
  ReactDOM.prefetchDNS("https://htlb.casalemedia.com");
  ReactDOM.prefetchDNS("https://timesinternet-d.openx.net");
  ReactDOM.prefetchDNS("https://ib.adnxs.com");
  ReactDOM.prefetchDNS("https://jssocdn.indiatimes.com/");
  ReactDOM.prefetchDNS("https://jsso.indiatimes.com/");
  ReactDOM.prefetchDNS("https://img.etimg.com/");
  ReactDOM.prefetchDNS("https://static.growthrx.in/");
  ReactDOM.prefetchDNS("https://static.growthrx.in/");

  return null;
}
