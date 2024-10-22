"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./Footer.module.scss";
import Image from "next/image";
import Search from "../Search";
import fbIcon from "../../../public/img/logos_facebook.svg";
import xIcon from "../../../public/img/logos_x.com.svg";
import linkedIcon from "../../../public/img/logos_linkedin.svg";
import rssIcon from "../../../public/img/logos_rss.svg";
import et_become from "../../../public/img/etprime-become-a-member.svg";
import android from "../../../public/img/android-on-google.svg";
import apple from "../../../public/img/app-store-download.svg";
import subscribe from "../../../public/img/subscribe-newsletter.svg";
import FooterList from "./FooterList";
import { APP_ENV, footerAPIHit } from "@/utils";
import GLOBAL_CONFIG from "@/network/global_config.json";
import { usePathname } from "next/navigation";

const Footer = ({ footerData }: any) => {
  const pathName = usePathname();
  const [footerRes, setFooterRes] = useState(footerData);
  const isFirstRender = useRef(true);
  const [isCCPA, setIsCCPA] = useState(false);
  useEffect(() => {
    async function footerFunc() {
      const footerData = await footerAPIHit(pathName);
      setFooterRes(footerData);
    }
    if (isFirstRender.current) {
      // Skip the first render
      isFirstRender.current = false;
      return;
    }
    footerFunc();
  }, [pathName]);

  const handleCCPA = () => {
    const checkCCPA =
      window.geoinfo &&
      window.geoinfo.geolocation == "2" &&
      window.geoinfo.region_code == "CA";
    setIsCCPA(checkCCPA);
  };

  useEffect(() => {
    document.addEventListener("geoLoaded", handleCCPA);
    return () => {
      document.removeEventListener("geoLoaded", handleCCPA);
    };
  }, []);

  const copyrightSection = () => {
    return (
      <div className={styles.row}>
        <div className={`copyright ${styles.copyright}`}>
          Copyright © {new Date().getFullYear()} Bennett, Coleman & Co. Ltd.
          All rights reserved. For reprint rights:{" "}
          <a
            data-ga-onclick="Times Syndication Service - href"
            href="https://timescontent.timesgroup.com/"
            target="_blank"
            rel="nofollow"
          >
            Times Syndication Service
          </a>
          {isCCPA && (
            <button id="ot-sdk-btn" className="ot-sdk-show-settings"></button>
          )}
        </div>

        <style jsx>{`
          .copyright {
            #ot-sdk-btn {
              &.ot-sdk-show-settings {
                border: 0;
                color: #9b9b9b;
                text-decoration: underline;
                font-size: 14px;
                line-height: 1;
                padding: 0 0 0 10px;

                &:hover {
                  background: 0;
                }
              }
            }
          }
        `}</style>
      </div>
    );
  };

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
            <Search pos="footer" />
          </div>
        </div>
        <div className={styles.ftBrowse}>
          <p>BROWSE COMPANIES:</p>
          <div className={styles.browseAll}>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/a`}
              title="A"
            >
              A
            </a>
            <a
              title="B"
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/b`}
            >
              B
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/c`}
              title="C"
            >
              C
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/d`}
              title="D"
            >
              D
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/e`}
              title="E"
            >
              E
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/f`}
              title="F"
            >
              F
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/g`}
              title="G"
            >
              G
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/h`}
              title="H"
            >
              H
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/i`}
              title="I"
            >
              I
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/j`}
              title="J"
            >
              J
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/k`}
              title="K"
            >
              K
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/l`}
              title="L"
            >
              L
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/m`}
              title="M"
            >
              M
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/n`}
              title="N"
            >
              N
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/o`}
              title="O"
            >
              O
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/p`}
              title="P"
            >
              P
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/q`}
              title="Q"
            >
              Q
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/r`}
              title="R"
            >
              R
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/s`}
              title="S"
            >
              S
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/t`}
              title="T"
            >
              T
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/u`}
              title="U"
            >
              U
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/v`}
              title="V"
            >
              V
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/w`}
              title="W"
            >
              W
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/x`}
              title="X"
            >
              X
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/y`}
              title="Y"
            >
              Y
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/stock-quotes/z`}
              title="Z"
            >
              Z
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}/markets/stocks/stock-quotes/numeric-1`}
              title="1"
            >
              1
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}/markets/stocks/stock-quotes/numeric-2`}
              title="2"
            >
              2
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}/markets/stocks/stock-quotes/numeric-3`}
              title="3"
            >
              3
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}/markets/stocks/stock-quotes/numeric-4`}
              title="4"
            >
              4
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}/markets/stocks/stock-quotes/numeric-5`}
              title="5"
            >
              5
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}/markets/stocks/stock-quotes/numeric-6`}
              title="6"
            >
              6
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}/markets/stocks/stock-quotes/numeric-7`}
              title="7"
            >
              7
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}/markets/stocks/stock-quotes/numeric-8`}
              title="8"
            >
              8
            </a>
            <a
              href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}/markets/stocks/stock-quotes/numeric-9`}
              title="9"
            >
              9
            </a>
          </div>
        </div>
      </div>
      <footer>
        <div className={`${styles.footerMidContainer} ${styles.footerSection}`}>
          {footerRes &&
            footerRes?.widgets?.map((item: any, index: number) => (
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
                <Image
                  src={xIcon}
                  width={40}
                  height={40}
                  quality={100}
                  alt="X"
                />
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
                  alt="LinkedIn"
                />
              </a>
              <a
                href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}rss.cms`}
                target="_blank"
                title="RSS"
              >
                <Image
                  src={rssIcon}
                  width={40}
                  height={40}
                  quality={100}
                  alt="RSS"
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
                title="Download ET App"
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
                title="Download ET App"
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
                href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}subscription`}
                target="_blank"
                title="subscribe to our newsletter"
              >
                <Image
                  src={subscribe}
                  width={52}
                  height={47}
                  quality={100}
                  alt="subscribe newsletter Img"
                />
                <h3 className={styles.footerSubscrTxt}>
                  subscribe to our newsletter
                </h3>
              </a>
            </div>
            <div className={styles.etprime}>
              <a
                href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}prime?utm_source=economictimes.indiatimes.com&utm_medium=footer&utm_campaign=ETPrimedistribution`}
                aria-label="ET Prime"
                target="_blank"
                title="ET Prime"
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
      </footer>
      {copyrightSection()}
    </div>
  );
};
export default Footer;
