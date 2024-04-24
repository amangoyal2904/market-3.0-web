import React from "react";
import styles from "./Footer.module.scss";
import Image from "next/image";
import Search from "../Search";
import ETLogo from "../../../public/et_markets_logo.svg";
import fbIcon from "../../../public/img/logos_facebook.svg";
import xIcon from "../../../public/img/logos_x.com.svg";
import linkedIcon from "../../../public/img/logos_linkedin.svg";
import rssIcon from "../../../public/img/logos_rss.svg";
import et_become from "../../../public/img/etprime-become-a-member.svg";
import android from "../../../public/img/android-on-google.svg";
import apple from "../../../public/img/app-store-download.svg";
import subscribe from "../../../public/img/subscribe-newsletter.svg";
import FooterList from "./FooterList";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";
import service from "@/network/service";

export const Footer = async () => {
  // =====  Get Left Nav Data =======
  const footerApi = (APIS_CONFIG as any)["FOOTER_LINKS"][APP_ENV];
  const footerPromise = await service.get({
    url: footerApi,
    params: {},
  });
  const footerResult = await footerPromise?.json();
  console.log("FOoter result---->", footerResult.widgets);
  return (
    <div className={styles.footerContainer}>
      <div className={`${styles.footerTopContainer} ${styles.footerSection}`}>
        <div className={styles.ftLogoSearch}>
          <div className={styles.ftLogo}>
            <a
              title="The Economic Times"
              href="https://economictimes.indiatimes.com"
            >
              <img
                className="f_logo_b hidden"
                loading="lazy"
                height="28"
                width="255"
                title="The Economic Times"
                alt="The Economic Times"
                src="https://img.etimg.com/photo/msid-74451948,quality-100/et-logo.jpg"
              />
            </a>
          </div>
          <div className={styles.ftSearch}>
            <Search location="footer" />
          </div>
        </div>
        <div className={styles.ftBrowse}>
          <p>BROWSE COMPANIES:</p>
          <div className={styles.browseAll}>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/a">
              A
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/b">
              B
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/c">
              C
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/d">
              D
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/e">
              E
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/f">
              F
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/g">
              G
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/h">
              H
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/i">
              I
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/j">
              J
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/k">
              K
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/l">
              L
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/m">
              M
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/n">
              N
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/o">
              O
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/p">
              P
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/q">
              Q
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/r">
              R
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/s">
              S
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/t">
              T
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/u">
              U
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/v">
              V
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/w">
              W
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/x">
              X
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/y">
              Y
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/z">
              Z
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/numeric-1">
              1
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/numeric-2">
              2
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/numeric-3">
              3
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/numeric-4">
              4
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/numeric-5">
              5
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/numeric-6">
              6
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/numeric-7">
              7
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/numeric-8">
              8
            </a>
            <a href="https://economictimes.indiatimes.com/markets/stocks/stock-quotes/numeric-9">
              9
            </a>
          </div>
        </div>
      </div>
      <div className={`${styles.footerMidContainer} ${styles.footerSection}`}>
        {footerResult &&
          footerResult?.widgets.map((item: any, index: number) => (
            <FooterList key={index} data={item.data} title={item.title} />
          ))}
      </div>
      <div
        className={`${styles.footerBottomContainer} ${styles.footerSection}`}
      >
        <div className={styles.alignLeft}>
          <div className={styles.followUs}>
            <h3>Follow us on:</h3>
            <a
              href="https://www.facebook.com/EconomicTimes"
              rel="nofollow"
              title="Facebook"
              target="_blank"
            >
              <Image
                src={fbIcon}
                width={40}
                height={40}
                quality={100}
                alt="Facebook"
              />
            </a>
            <a
              href="https://twitter.com/economictimes"
              rel="nofollow"
              target="_blank"
              title="Twitter"
            >
              <Image src={xIcon} width={40} height={40} quality={100} alt="X" />
            </a>
            <a
              href="https://www.linkedin.com/company/economictimes"
              rel="nofollow"
              target="_blank"
              title="LinkedIn"
            >
              <Image
                src={linkedIcon}
                width={40}
                height={40}
                quality={100}
                alt="X"
              />
            </a>
            <a
              href="https://economictimes.indiatimes.com/rss.cms"
              target="_blank"
              title="RSS"
            >
              <Image
                src={rssIcon}
                width={40}
                height={40}
                quality={100}
                alt="X"
              />
            </a>
          </div>
          <div className={styles.etDwnld}>
            <h3>Download ET App:</h3>
            <a
              href="https://play.google.com/store/apps/details?id=com.et.reader.activities"
              rel="nofollow"
              aria-label="ET Play Store"
              target="_blank"
            >
              <Image
                src={android}
                width={98}
                height={27}
                quality={100}
                alt="ET Markets"
              />
            </a>
            <a
              href="https://itunes.apple.com/us/app/the-economic-times/id474766725?ls=1&amp;t=8apple.com/us"
              rel="nofollow"
              aria-label="ET App Store"
              target="_blank"
            >
              <Image
                src={apple}
                width={98}
                height={27}
                quality={100}
                alt="ET Markets"
              />
            </a>
          </div>
        </div>
        <div className={styles.alignRight}>
          <div className={styles.subscribe}>
            <a
              href="https://economictimes.indiatimes.com/subscription"
              target="_blank"
            >
              <Image
                src={subscribe}
                width={52}
                height={47}
                quality={100}
                alt="Subscribe"
              />
              <h3 className={styles.footerSubscrTxt}>
                subscribe to our newsletter
              </h3>
            </a>
          </div>
          <div className={styles.etprime}>
            <a
              href="https://economictimes.indiatimes.com/prime?utm_source=economictimes.indiatimes.com&amp;utm_medium=footer&amp;utm_campaign=ETPrimedistribution"
              aria-label="ET Prime"
              target="_blank"
            >
              <Image
                src={et_become}
                width={160}
                height={59}
                quality={100}
                alt="ET Markets"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
