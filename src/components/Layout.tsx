"use client";

import React, { FC, ReactElement, useEffect } from "react";
import Headers from "./Head";
import Scripts from "./Scripts";
import Footer from "./Footer";
import Header from "./Header";
import RedeemVoucher from "./RedeemVoucher";
import LeftNav from "./LeftNav";

interface Props {
  page?: string;
  dynamicFooterData?: any;
  menuData?: any;
  data: any;
  leftNavResult: any;
  children?: ReactElement;
}

interface ChildProps {
  data: any;
}

const Layout: FC<Props> = ({
  page,
  dynamicFooterData,
  menuData,
  data,
  leftNavResult,
  children,
}) => {
  if (!data?.seo?.subsecnames || !data?.seo?.sectionDetail) {
    data.seo = {};
    data.seo.subsecnames = {};
    //throw new Error('Invalid data passed to Layout component');
  }

  return (
    <>
      {/* <StateProvider> */}
      <Headers />
      <Header />
      <main className={`pageHolder container`}>
        <div className="layout">
          {<LeftNav leftNavResult={leftNavResult} />}
          {children}
        </div>
        <Scripts />
        <Footer />
      </main>
      <div className={`ssoLoginWrap hide`} id="ssoLoginWrap">
        <div id="ssoLogin" className="ssoLoginElm" />
      </div>
      <RedeemVoucher />
      {/* </StateProvider>       */}
    </>
  );
};

export default Layout;
