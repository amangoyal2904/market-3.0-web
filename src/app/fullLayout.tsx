import Header from "@/components/Header";
import Scripts from "@/components/Scripts";
import LeftNav from "@/components/LeftNav";
import RedeemVoucher from "@/components/RedeemVoucher";
import APIS_CONFIG from "../network/api_config.json";
import { APP_ENV, footerAPIHit } from "@/utils";
import service from "@/network/service";
import Footer from "@/components/Footer";
import GLOBAL_CONFIG from "@/network/global_config.json";

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

export default async function FullLayout({
  children,
  pageUrl,
  isprimeuser,
}: {
  children: React.ReactNode;
  pageUrl: string;
  isprimeuser: boolean;
}) {
  const versionControl = {};
  const footerData = await footerAPIHit(pageUrl);
  // =====  Get Left Nav Data =======
  const leftNavApi = (APIS_CONFIG as any)["LEFT_NAV"][APP_ENV];
  const leftNavPromise = await service.get({
    url: leftNavApi,
    params: {},
  });

  const leftNavResult = await leftNavPromise?.json();

  return (
    <>
      <main>
        <Header />
        <div className="container">
          <LeftNav leftNavResult={leftNavResult} />
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
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSchema),
        }}
      />
    </>
  );
}
