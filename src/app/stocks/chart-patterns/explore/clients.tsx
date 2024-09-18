"use client";
import TopNav from "@/components/ChartPatterns/TopNav";
import { useStateContext } from "@/store/StateContext";
import styles from "./Explore.module.scss";
import { Fragment, useEffect, useState } from "react";
import jStorageReact from "jstorage-react";
import ChartPatternPaywall from "@/components/ChartPatterns/ChartPatternPaywall";
import Link from "next/link";
import Blocker from "@/components/Blocker";

const ExploreChartPatternsClient = ({ response, pageUrl }: any) => {
  const { state } = useStateContext();
  const { isPrime, isLogin, ssoReady, ssoid, ticketId } = state.login;
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    if (ssoReady) {
      const payWalledShow = jStorageReact.get("chartPatternPaywallShown");
      if (!payWalledShow) setShowPaywall(true);
    }
  }, [ssoReady]);

  return (
    <>
      <TopNav pageUrl={pageUrl} />
      {response && response.length > 0 ? (
        response.map((pattern: any, index: number) => (
          <div className={styles.patternsList} key={index}>
            <div className={styles.pattern}>
              <h2 className={styles.title}>{pattern?.masterPattern}</h2>
              {pattern?.subPattern && pattern?.subPattern.length > 0 ? (
                <div className={styles.cards}>
                  {pattern?.subPattern.map(
                    (subPattern: any, subIndex: number) => (
                      <Fragment key={subIndex}>
                        <div className={styles.card}>
                          <div className={styles.detailsContainer}>
                            <img
                              src={subPattern?.patternImage}
                              width={106}
                              height={80}
                              alt={subPattern?.name}
                            />
                            <div className={styles.rightContainer}>
                              <h3 className={styles.title}>
                                {subPattern?.patternName}
                              </h3>
                              <p
                                className={styles.desc}
                                dangerouslySetInnerHTML={{
                                  __html: subPattern?.patternText,
                                }}
                              ></p>
                            </div>
                          </div>
                          <div className={styles.ctaContainer}>
                            <Link
                              className={`${styles.cta} ${styles.outline}`}
                              href={
                                subPattern?.seoPatternName !== "bullish"
                                  ? `/stocks/chart-patterns/past-patterns/${subPattern?.seoPatternName}`
                                  : "/stocks/chart-patterns/past-patterns"
                              }
                              title={`View ${subPattern?.patternName} Past Performance`}
                            >
                              View Past Performance
                            </Link>
                            <Link
                              className={styles.cta}
                              href={`/stocks/chart-patterns/${subPattern?.seoPatternName}`}
                              title={`${subPattern?.patternName} New Trading Ideas (${subPattern?.newPatternCount})`}
                            >
                              {`New Trading Ideas (${subPattern?.newPatternCount})`}
                            </Link>
                          </div>
                        </div>
                      </Fragment>
                    ),
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        ))
      ) : (
        <Blocker type={"noDataFound"} />
      )}
      <ChartPatternPaywall
        isLogin={isLogin || false}
        isPrime={isPrime || false}
        pageUrl={pageUrl}
        showPayWall={showPaywall}
        onPaywallStateChange={() => setShowPaywall(false)}
      />
    </>
  );
};

export default ExploreChartPatternsClient;
