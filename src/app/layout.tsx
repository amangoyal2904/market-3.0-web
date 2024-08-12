import { Montserrat, Lato } from "next/font/google";
import localFont from "next/font/local";
import "../styles/globals.scss";
import { cookies, headers } from "next/headers";
import { StateProvider } from "@/store/StateContext";
import NextTopLoader from "nextjs-toploader";
import { Metadata } from "next";
import { PreloadResources } from "@/components/preloadResources";
import { Toaster } from "react-hot-toast";
import FullLayout from "./fullLayout";

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

const eticons = localFont({
  src: "./assets/fonts/eticons.woff",
  weight: "normal",
  display: "swap",
  variable: "--font-eticons",
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
    icon: "/marketsweb/etfavicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isprimeuser = cookies().get("isprimeuser") ? true : false;
  const headersList = headers();
  const pageUrl = headersList.get("x-url") || "";
  const noLayout = pageUrl == "/chart";

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${lato.variable} ${eticons.variable} h-full bg-gray-50`}
    >
      <body className="h-full">
        {!noLayout ? (
          <>
            <NextTopLoader template='<div class="bar" role="bar"><div class="peg"></div></div>' />
            <PreloadResources />
          </>
        ) : (
          ""
        )}
        <StateProvider>
          {noLayout ? (
            <main>{children}</main>
          ) : (
            <FullLayout pageUrl={pageUrl} isprimeuser={isprimeuser}>
              {children}
            </FullLayout>
          )}
          <Toaster position="bottom-right" reverseOrder={false} />
        </StateProvider>
      </body>
    </html>
  );
}
