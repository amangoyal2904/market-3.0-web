import service from "@/network/service";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";

export const getTechnicalChartPageMetaData = (symbolData: any) => {
  const type = symbolData.type || symbolData.entity;
  const name = symbolData.description || symbolData.fullName;
  const exchange = symbolData["exchange-traded"] || symbolData.exchange;

  // Default title if name or type is not valid
  const defaultTitle =
    "Technical Analysis, Technical Charts for all NSE, BSE Stocks/Shares & Indices (Sensex, Nifty, all Companies)";

  let metaTitle = "";
  let metaDesc = "";
  let metaKeywords = "";

  if (typeof name !== "string" || !name || typeof type !== "string" || !type) {
    metaTitle = defaultTitle;
    metaDesc = `Technical Charts: Real-time and intraday charts for all NSE, BSE Stocks/Shares, Nifty, Sensex and Indices, MCX Commodity Futures/Spot, Forex, Stocks, Currency, Commodities. Technical analysis tools, technical indicator studies like Bollinger Bands, MACD, Moving averages, RSI etc. The Charting platform offers interval/intraday & end of day (EOD) charts, provides multiple periodicities (1 min, 5 min, 10 min, 15 min, 1 day, 1 week, 1 month etc) on The Economic Times.`;
    metaKeywords = `Technical Analysis, NSE Charts, BSE stocks, Currency Charts, Real Time Charts, Technical Studies`;
  } else if (type === "stock") {
    metaTitle = `${name} Technical Chart ${exchange} Stock Analysis, ${name} Technical Chart Analysis`;
    metaDesc = `Find ${name} Technical Chart ${exchange} Analysis on The Economic Times. Get ${name} Technical Charts Real-time and intraday charts, ${name} Stock Analysis, and more.`;
    metaKeywords = `${name} Technical Chart, ${name} Stock Analysis, ${exchange} Technical Chart Analysis, ${name} Technical Intraday Charts, ${name} Technical Chart Real Time`;
  } else {
    metaTitle = `${name} - ${exchange} Technical Chart | Technical Analysis, Real-Time Charts, Technical Studies`;
    metaDesc = `Technical Charts: Real-time and intraday charts for all NSE, BSE Stocks/Shares, Nifty, Sensex and Indices, MCX Commodity Futures/Spot, Forex, Stocks, Currency, Commodities. Technical analysis tools, technical indicator studies like Bollinger Bands, MACD, Moving averages, RSI etc. The Charting platform offers interval/intraday & end of day (EOD) charts, provides multiple periodicities (1 min, 5 min, 10 min, 15 min, 1 day, 1 week, 1 month etc) on The Economic Times.`;
    metaKeywords = `${name} technical charts, technical studies, NSE Charts, BSE stocks, currency charts, real-time Charts`;
  }

  return {
    title: metaTitle,
    desc: metaDesc,
    keywords: metaKeywords,
  };
};

export const getTechnicalChartNews = async () => {
  const response = await service.get({
    url: `${(APIS_CONFIG as any)?.TECHNICAL_FEED[APP_ENV]}`,
    params: {},
  });
  return await response?.json();
};
