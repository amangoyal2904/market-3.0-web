import "../styles/globals.scss";
import Headers from "@/components/Head";
import { Suspense } from "react";
import Header from "@/components/Header";
import Scripts from "@/components/Scripts";
import LeftNav from "@/components/LeftNav";
import { cookies } from "next/headers";
import RedeemVoucher from "@/components/RedeemVoucher";
import APIS_CONFIG from "../network/api_config.json";
import { APP_ENV } from "@/utils";
import service from "@/network/service";
import { StateProvider } from "@/store/StateContext";
import NextTopLoader from "nextjs-toploader";
import { Metadata } from "next";

declare global {
  interface Window {
    objVc: any;
    __APP: {
      env?: string;
    };
  }
}

export const metadata: Metadata = {
  title:
    "Share Market Live, Share Market Today: Latest Share Market News, Share Market Live Updates on The Economic Times",
  description:
    "Share Market Today | Share Market Live updates: Get all the Latest Share Market News and Updates on The Economic Times. Share Market Live Charts, News, Analysis, IPO News and more.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const versionControl = {};
  const isprimeuser = cookies().get("isprimeuser") ? true : false;

  // =====  Get Left Nav Data =======
  const leftNavApi = (APIS_CONFIG as any)["LEFT_NAV"][APP_ENV];
  const leftNavPromise = await service.get({
    url: leftNavApi,
    params: {},
  });

  const leftNavResult = await leftNavPromise?.json();

  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="h-full">
        <NextTopLoader />
        <StateProvider>
          <main>
            <Headers />
            <Header />
            <div className="container">
              <Suspense fallback={<p>Loading...</p>}>
                <LeftNav leftNavResult={leftNavResult} />
              </Suspense>
              <div className="main_container">{children}</div>
            </div>
            <Scripts objVc={versionControl} isprimeuser={isprimeuser} />
            <div className={`ssoLoginWrap hide`} id="ssoLoginWrap">
              <div id="ssoLogin" className="ssoLoginElm" />
            </div>
            <RedeemVoucher />
          </main>
        </StateProvider>
      </body>
    </html>
  );
}
