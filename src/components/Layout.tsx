'use client';

import React, {FC, ReactElement, useEffect } from 'react';
import Headers from './Head';
import Scripts from './Scripts';
import Footer from './Footer';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Header from './Header';
import { StateProvider } from "../store/StateContext";

interface Props {
  page?: string;
  dynamicFooterData?: any;
  menuData?: any;
  objVc?: any;
  isprimeuser?: boolean | number;
  data: any;
  children?: ReactElement;
}

interface ChildProps {
  objVc: any;
  isprimeuser: any;
  data: any;
}

const Layout:FC<Props> = ({ page, dynamicFooterData, menuData, objVc, data, isprimeuser, children }) => { 
  
  if (!data?.seo?.subsecnames || !data?.seo?.sectionDetail) {
    data.seo = {};
    data.seo.subsecnames = {};
    //throw new Error('Invalid data passed to Layout component');
  }

 

  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
      <>
      <StateProvider>
        <Headers />
          <Header/>
          <main className={`pageHolder container`}>
          <div className="layout">{children}</div>
          <Scripts objVc={objVc} isprimeuser={isprimeuser} />
          <Footer/>
          </main> 
          <div className={`ssoLoginWrap hide`} id="ssoLoginWrap">
              <div id="ssoLogin" className="ssoLoginElm"/>
          </div> 
      </StateProvider>      
      </>
    );
}

export default Layout;