import React from "react";
import styles from "./TextBottom.module.scss";
import { APP_ENV } from "@/utils";
import GLOBAL_CONFIG from "@/network/global_config.json";

interface Props {
  indicesName: string;
}
const TextBottom: React.FC<Props> = ({ indicesName }) => {
  return (
    <>
      {indicesName == "Nifty 50" ? (
        <>
          <div className={styles.about}>
            <h2 className={styles.header}>About Nifty</h2>
            <p>
              The Nifty is the flagship benchmark of the National Stock Exchange
              (NSE), which is a well-diversified index, comprising top 50
              companies in terms of free-float market capitalisation that are
              traded on the bourse. It is supposed to reflect the health of the
              listed universe of Indian companies, and hence the broader
              economy, in all market conditions.
            </p>
            <p>
              Officially called the Nifty50, the index is computed using the
              free float market capitalisation method, which is essentially the
              count of shares in active circulation in the market at any given
              point of time.
            </p>
            <p>
              The Nifty, just like BSE benchmark Sensex, is today used for
              benchmarking portfolios and returns of mutual fund schemes and
              launching index funds.
            </p>
            <p>
              The Nifty index was launched on April 22, 1996, with a base value
              of 1,000 counted from November 3, 1995. Live Nifty quotes are
              available on NSEIndia.com, ETMarkets.com and numerous other web
              platforms and TV channels at any point of time.
            </p>
            <p>
              The Nifty brand and indices are managed by the Mumbai-based India
              Index Services and Products Limited, IISL in short, which itself
              is a subsidiary of NSE. IISL has a three-tier governance structure
              comprising the board of directors, the index policy committee and
              the index maintenance sub-committee. IISL managed some 67 indices
              under the Nifty brand as of September 30, 2016.
            </p>
            <p>
              IISL rebalances the Nifty index semi-annually. The cut-off dates
              for the semi-annual review of the index are January 31 and July 31
              each year. Average data for the six months ending the cut-off date
              is considered. The exchange notifies any change in the index four
              weeks before such changes take effect.
            </p>
            <p>
              There are defined eligibility criteria for selection of Nifty
              constituent stocks. The liquidity of a stock is measured by the
              market impact cost, which is essentially the cost involved in
              transacting a stock. For a stock to qualify for inclusion in the
              Nifty50, it must have traded at an average impact cost of 0.50 per
              cent or less for six months and for 90 per cent of observation
              cases.
            </p>
            <p>
              Besides, the company must have a listing history of at least six
              months. However, a newly-listed company, which has just got listed
              through the IPO route, may become eligible for inclusion in the
              index, if it fulfils the normal eligibility criteria for a three-
              month period instead of six months.
            </p>
            <p>
              Only those stocks which are eligible for trade in the F&amp;O
              segment of NSE are considered for inclusion as Nifty constituents.
            </p>
            <p>
              As of September 20, 2017, the Nifty had 35.73 per cent components
              from the financial services sector, 14 per cent from the energy
              sector, 11.46 per cent from the information technology sector,
              10.64 per cent from the automobile sector and 10.13 per cent from
              the consumer goods sector. Six of the nine BFSI companies in the
              Nifty50 were private banks.
            </p>
            <p>
              The Nifty index also has several variants such as Nifty Junior,
              Nifty50 USD, Nifty50 Total Returns index and NIFTY50 Dividend
              Points Index.
            </p>
          </div>
        </>
      ) : indicesName == "S&P BSE Sensex" ? (
        <>
          <div className={styles.about}>
            <h2 className={styles.header}>About Sensex</h2>
            <p>
              The Sensex, also known as the sensitivity index, is the benchmark
              index of BSE Limited and is the most widely tracked equity gauge
              in India.
            </p>
            <p>
              Officially known as the S&P BSE Sensex since February, 2013, the
              index captures the performance of the top 30 largest, most liquid
              and financially stable companies from across major sectors of the
              Indian economy that are listed on the exchange. It reflects the
              health of the equity market, investor sentiment and broadly the
              state of the economy.
            </p>
            <p>
              The Sensex was launched on January 1, 1986, with the base value of
              100 set on April 1, 1979. The credit for coining the term, Sensex,
              goes to Deepak Mohoni, a stock market analyst and IIT, Kanpur
              graduate and IIM, Calcutta alumnus.
            </p>
            <p>
              As of September 20, 2017, the index was hovering above the 30,000
              mark. It is the oldest index in the country, while the Bombay
              Stock Exchange, now called BSE Limited, is the oldest exchange in
              Asia.
            </p>
            <p>
              The Sensex is managed and operated by a joint venture between BSE
              and S&P Dow Jones Indices, a global index manager. The composition
              of the Sensex is recast or modified from time to time to represent
              the true composition of the market.
            </p>
            <p>
              Stocks in the eligible universe must satisfy the following
              eligibility criteria in order to be considered for inclusion in
              the Sensex. First of all, the stocks must have a listing history
              of at least six months on BSE. An exception may be granted if the
              average float-adjusted market capitalisation of a newly-listed
              stock ranks in the top 10 of all stocks listed on BSE. In such a
              case, the minimum listing history required is one month.
            </p>
            <p>
              The qualified stock has to trade on every trading day on BSE
              during the six-month reference period. Also, the eligible
              companies must have reported revenues for the preceding four
              quarters.
            </p>
            <p>
              BSE on December 6, 2016 launched the S&P BSE Sensex50 index, which
              is designed to measure the performance of the 50 largest and most
              liquid companies within the S&P BSE100 index.
            </p>
            <p>
              Investors, traders and anyone keen on the equity market can track
              Sensex quotes live on BSEIndia.com, ETMarkets.com and countless
              other websites and TV channels from 9.00 am to 3.30 pm on all
              weekdays. Financial markets in India remain closed on Saturday,
              Sunday and on select public holidays such as Independence Day,
              Holi, Republic Day, etc.
            </p>
            <p>
              Sensex live graphs and figures are available on the BSE website.
              Besides Sensex live updates, one can also track real-time data of
              a slew of other indices such as BSE Midcap index, BSE100 index,
              various sectoral indices, top gainers, losers on the BSE webpage.
            </p>
            <p>
              As of September 2017, the Sensex index had the following stocks as
              its constituents: Wipro, Coal India, HDFC, ITC, M&M, Tata Motors,
              Power Grid, Maruti, Kotak Bank, HDFC Bank, TCS, ONGC, Bharti
              Airtel, NTPC, Asian Paint, Sun Pharma, Dr Reddy&apos;s, HUL,
              Infosys, Bajaj Auto, Cipla, Axis Bank, Lupin, Adani Ports, SBI,
              Hero MotoCorp, ICICI Bank, Reliance Industries, L&T and Tata
              Steel.
            </p>

            <h2 className={styles.header}>FAQs</h2>
            <div className={styles.newsDisplay}>
              <div data-curpg="1" className={styles.dataContainer}>
                <div className={styles.faq}>
                  <h3 className={styles.story_list}>
                    <a
                      className={styles.semibold}
                      target="_blank"
                      title="What is share market?"
                      href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/news/what-is-share-market/articleshow/59531308.cms`}
                    >
                      What is share market?
                    </a>
                  </h3>
                  <div className={styles.syn}>
                    The stock market is a share market, however besides shares
                    of companies, other instruments are traded too. The share
                    market is a source for companies to raise funds and for
                    investors to buy part-ownership in growing businesses and
                    grow their wealth. On becoming a shareholder, an investor
                    earns a part of the profits earned by the company by way of
                    dividend. At the same time, the investor also undertakes the
                    risk to bear loses, should the business fail to perform
                    well. Market participants need to get registered with the
                    stock exchange and market regulator Sebi to be able to trade
                    in the stock market.
                  </div>
                  <h3 className={styles.story_list}>
                    <a
                      title="How to buy shares?"
                      className={styles.semibold}
                      target="_blank"
                      href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/news/how-to-buy-shares/articleshow/59531362.cms`}
                    >
                      How to buy shares?
                    </a>
                  </h3>
                  <div className={styles.syn}>
                    Demat and trading accounts are provided by the two
                    depositories, NSDL and CDSL, through brokerage firms. In
                    order to open these accounts, one has to contact a
                    brokerage. There are different brokerage firms and each has
                    its own unique plans and products, a range of charges, which
                    generally range from 0.01 per cent to 0.05 per cent. Some
                    brokerages offer flat rates. Brokers are to be chosen wisely
                    and with utmost care. In order to buy a share listed on the
                    NSE or BSE, one needs a stock broker. Brokers are of two
                    types a. full service brokers b. discount brokers.
                  </div>
                  <h3 className={styles.story_list}>
                    <a
                      title="How can I invest in share market?"
                      className={styles.semibold}
                      target="_blank"
                      href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/news/how-can-i-invest-in-share-market/articleshow/59530915.cms`}
                    >
                      How can I invest in share market?
                    </a>
                  </h3>
                  <div className={styles.syn}>
                    PAN card or an Aadhar card is a mandatory requirement for
                    investing in India. It is required for KYC (know your
                    client) procedure while opening an account with the market
                    regulator, the Securities and Exchange Board of India
                    (Sebi). Besides this, the government has mandated six-month
                    bank statement along with a cancelled cheque, under the new
                    rules to open a demat account. A person cannot go directly
                    to the stock market to buy or sell shares. Buying and
                    selling of stocks has to be done through brokers. They are
                    individuals, companies or agencies registered with and
                    authorised by Sebi to trade on the stock exchanges.
                  </div>
                  <h3 className={styles.story_list}>
                    <a
                      className={styles.semibold}
                      target="_blank"
                      title="How can I start investing in financial market in India?"
                      href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/news/how-can-i-start-investing-in-financial-market-in-india/articleshow/59531261.cms`}
                    >
                      How can I start investing in financial market in India?
                    </a>
                  </h3>
                  <div className={styles.syn}>
                    Bank savings and regular income cannot be enough for wealth
                    creation. Investment in stock, debt markets and even
                    commodities can help grow you wealth and even prove to be an
                    added source of income. Most importantly, unlike most fixed
                    income assets such as bank fixed deposits, equity investment
                    can help beat inflation. There are various ways to invest in
                    the financial markets in India. Primary market is the market
                    where a company or government floats its securities for
                    first-time buyers. Secondary market is the market where
                    already issued financial instruments such as bonds, shares,
                    etc are bought and sold.
                  </div>
                  <h3 className={styles.story_list}>
                    <a
                      className={styles.semibold}
                      target="_blank"
                      title="How to invest in dividend stocks?"
                      href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/news/how-to-invest-in-dividend-stocks/articleshow/59646546.cms`}
                    >
                      How to invest in dividend stocks?
                    </a>
                  </h3>
                  <div className={styles.syn}>
                    Dividend is a portion of net income that a company
                    distributes among its shareholders. There are several
                    companies in the domestic equity market that pay dividends
                    to investors on a regular basis. Some of the stocks on the
                    list include BPCL, IOC and Coal India. For identifying a
                    dividend stock, one must consider companies that pay
                    dividend to shareholders consistently and whose dividend
                    yield is high. To invest in stocks, one must first have a
                    demat and a trading account. Then one has to register with a
                    stock broker or brokerage firm. Investors must make sure
                    that the broker or brokerage is registered with Sebi and the
                    stock exchanges.
                  </div>
                  <h3 className={styles.story_list}>
                    <a
                      className={styles.semibold}
                      target="_blank"
                      title="How to read analyst ratings of stocks?"
                      href={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}markets/stocks/news/all-you-need-to-know-about-analyst-ratings/articleshow/59802338.cms`}
                    >
                      How to read analyst ratings of stocks?
                    </a>
                  </h3>
                  <div className={styles.syn}>
                    A rating is a measure of a stock&apos;s expected performance
                    in a given time period.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default TextBottom;
