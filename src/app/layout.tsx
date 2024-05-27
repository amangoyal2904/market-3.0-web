import { Montserrat, Lato } from "next/font/google";
import localFont from "next/font/local";
import "../styles/globals.scss";
import { Suspense } from "react";
import Header from "@/components/Header";
import Scripts from "@/components/Scripts";
import LeftNav from "@/components/LeftNav";
import { cookies, headers } from "next/headers";
import RedeemVoucher from "@/components/RedeemVoucher";
import APIS_CONFIG from "../network/api_config.json";
import { APP_ENV, footerAPIHit } from "@/utils";
import service from "@/network/service";
import { StateProvider } from "@/store/StateContext";
import NextTopLoader from "nextjs-toploader";
import { Metadata } from "next";
import Footer from "@/components/Footer";
import { PreloadResources } from "@/components/preloadResources";
import { Toaster } from "react-hot-toast";
import GLOBAL_CONFIG from "@/network/global_config.json";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lato",
});
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
  icons: {
    icon: "/etfavicon.ico",
  },
};

const webSchema = {
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  name: "Economic Times",
  url: (GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"],
  logo: {
    "@type": "ImageObject",
    url: "https://img.etimg.com/thumb/msid-76939477,width-600,height-60,quality-100/economictimes.jpg",
    width: 600,
    height: 60,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const versionControl = {};
  const isprimeuser = cookies().get("isprimeuser") ? true : false;
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const pathname = headersList.get("x-pathname");
  const footerData = await footerAPIHit(pageUrl);
  // =====  Get Left Nav Data =======
  const leftNavApi = (APIS_CONFIG as any)["LEFT_NAV"][APP_ENV];
  const leftNavPromise = await service.get({
    url: leftNavApi,
    params: {},
  });

  const leftNavResult = await leftNavPromise?.json();

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${lato.variable} h-full bg-gray-50`}
    >
      <body className="h-full">
        <NextTopLoader template='<div class="bar" role="bar"><div class="peg"></div></div>' />
        <PreloadResources />
        <StateProvider>
          <main>
            <Header />
            <div className="container">
              <Suspense fallback={<p>Loading...</p>}>
                <LeftNav leftNavResult={leftNavResult} />
              </Suspense>
              <div className="main_container">{children}</div>
              <div className="bcAdContainer"></div>
            </div>
            <div className="pageBottomContainer">
              <Footer footerData={footerData} />
            </div>
            <Scripts objVc={versionControl} isprimeuser={isprimeuser} />
            <div className={`ssoLoginWrap hide`} id="ssoLoginWrap">
              <div id="ssoLogin" className="ssoLoginElm" />
            </div>
            <RedeemVoucher />
            <Toaster position="bottom-right" reverseOrder={false} />
          </main>
        </StateProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSchema),
          }}
        />
      </body>
    </html>
  );
}
