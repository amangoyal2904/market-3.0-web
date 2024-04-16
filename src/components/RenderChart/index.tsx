"use client";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import styles from "./RenderChart.module.scss";

interface RenderChartProps {
  type?: string;
  symbol?: string;
  exchange?: string;
  period?: string;
}

const RenderChart: React.FC<RenderChartProps> = ({
  type = "index",
  symbol = "SENSEX",
  exchange = "NSE",
  period = "1D",
}) => {
  const [chartOptions, setChartOptions] = useState<any>(null);
  const [previousClose1d, setPreviousClose1d] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, [type, symbol, exchange, period]);

  const calculateFromDate = (period: string): number => {
    const timestamp = Date.now();
    if (period === "1w") {
      return timestamp - 7 * 86400000;
    } else if (period === "1m") {
      return timestamp - 30 * 86400000;
    } else if (period === "3m") {
      return timestamp - 90 * 86400000;
    } else if (period === "6m") {
      return timestamp - 180 * 86400000;
    } else if (period === "1y") {
      return timestamp - 365 * 86400000;
    } else if (period === "3y") {
      return timestamp - 365 * 3 * 86400000;
    } else {
      return timestamp - 365 * 5 * 86400000;
    }
  };

  const getServiceUrl = (
    type: string,
    symbol: string,
    exchange: string,
    period: string,
  ): string => {
    let serviceUrl: string;
    const timestamp = calculateFromDate(period);
    if (period === "1d") {
      switch (type) {
        case "stock":
          serviceUrl = `https://bselivefeeds.indiatimes.com/ETLiveFeedChartRead/livecharts?scripcode=${symbol}&exchangeid=${exchange === "NSE" ? 50 : 47}&datatype=intraday&scripcodetype=company&filtertype=1MIN&directions=all`;
          break;
        case "commodity":
          serviceUrl = `https://etelection.indiatimes.com/ET_Charts/commodityintraday?commoditysymbol=${symbol}`;
          break;
        case "forex":
          serviceUrl = `https://etelection.indiatimes.com/ET_Charts/forexintraday?currencypairname=${symbol}`;
          break;
        default:
          serviceUrl = `https://bselivefeeds.indiatimes.com/ETLiveFeedChartRead/livecharts?scripcode=${symbol}&exchangeid=${exchange === "NSE" ? 50 : 47}&datatype=intraday&scripcodetype=index&filtertype=1MIN&directions=all`;
      }
      return serviceUrl;
    } else {
      const chartType = type === "commodity" ? "mcx-commodity" : type;
      const resolution = period === "1w" ? "10" : "1D";
      const toDate = Math.floor(timestamp / 1000);
      const fromDate =
        period === "1w" && type !== "commodity"
          ? Math.floor(timestamp / 1000)
          : calculateFromDate(period);
      const countback = period === "1w" && type !== "commodity" ? 240 : 0;
      serviceUrl = `https://etelection.indiatimes.com/ET_Charts/india-market/${chartType}/history?symbol=${symbol}&resolution=${resolution}&from=${fromDate}&to=${toDate}&countback=${countback}`;
      return serviceUrl;
    }
  };

  const fetchData = () => {
    const url = getServiceUrl(type, symbol, exchange, period);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (
          period === "1d" &&
          data.query &&
          data.query.results &&
          data.query.results.quote.length > 0
        ) {
          let prevClose = "";
          const quotes = data.query.results.quote;
          quotes.forEach((quote: any) => {
            quote.Date = quote.Date.replace(/-/g, "/");
          });
          if (quotes.length > 0) {
            if (
              data.query.results.companydata &&
              data.query.results.companydata.previouscloseprice !== undefined
            ) {
              prevClose = data.query.results.companydata.previouscloseprice;
            } else if (
              data.query.results.Commodityinfo &&
              data.query.results.Commodityinfo.previouscloseprice !== undefined
            ) {
              prevClose = data.query.results.Commodityinfo.previouscloseprice;
            } else if (
              data.query.results.currencypairdetails &&
              data.query.results.currencypairdetails[0].previouscloseprice !==
                undefined
            ) {
              prevClose =
                data.query.results.currencypairdetails[0].previouscloseprice;
            }
          }
          setPreviousClose1d(prevClose ? +Number(prevClose).toFixed(2) : null);
          const results = quotes.map((quote: any) => {
            return [
              new Date(quote.Date).getTime(),
              period === "1d" ? +quote.Open : +quote.Adj_Close,
            ];
          });
          drawChart(results);
        } else if (data.t && data.c && data.t.length > 0 && data.c.length > 0) {
          const results = data.t.map((timestamp: number, index: number) => {
            return [timestamp * 1000, +data.c[index]];
          });
          drawChart(results);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const drawChart = (data: any[]) => {
    if (period === "1d") {
      data = data.reverse();
    }
    const cf = getColorNGradientFlag(data);
    const color = cf[0];
    const gradientFlag = cf[1];

    const nData = JSON.parse(JSON.stringify(data));

    Highcharts.setOptions({
      lang: {
        thousandsSep: ",",
      },
      global: {
        useUTC: false,
      },
    });

    const options = {
      chart: {
        zoomType: "x",
        backgroundColor: "#FFE9E2", // You can customize the background color here
        height: 400, // Adjust the chart height as needed
      },
      title: {
        text: "Stock Chart",
      },
      series: [
        {
          type: "area",
          name: "Adj Close",
          data: nData,
          animation: true,
          color: color,
          fillColor: {
            linearGradient: {
              x1: 0,
              x2: 0,
              y1: 0,
              y2: 1,
            },
            stops: [
              [
                0,
                gradientFlag
                  ? "rgba(88, 206, 149, 0.7)"
                  : "rgba(255, 157, 157, 1)",
              ],
              [
                1,
                gradientFlag
                  ? "rgba(88, 206, 149, 0.1)"
                  : "rgba(255, 157, 157, 0)",
              ],
            ],
          },
        },
      ],
      xAxis: {
        type: "datetime",
        gridLineColor: "#D2D6D7", // Adjust the grid line color here
        gridLineWidth: 1, // Adjust the grid line width here
        dateTimeLabelFormats: {
          day: "%e %b",
        },
        title: {
          text: "Date",
        },
        labels: {
          formatter: function (this: any) {
            return Highcharts.dateFormat("%e %b", this.value);
          },
        },
      },
      yAxis: {
        title: {
          text: "Price",
        },
      },
      tooltip: {
        formatter: function (this: any) {
          return (
            "<b>" +
            Highcharts.dateFormat("%e %b, %Y", this.x) +
            "</b><br/>" +
            this.series.name +
            ": " +
            this.y.toFixed(2)
          );
        },
      },
    };

    setChartOptions(options);
  };

  const getColorNGradientFlag = (data: any[]): [string, boolean] => {
    const firstData = data[0][1];
    const lastData = data[data.length - 1][1];
    const color = lastData > firstData ? "#00ff00" : "#ff0000";
    const gradientFlag = lastData > firstData;
    return [color, gradientFlag];
  };

  return (
    <div id={styles.renderChart}>
      {chartOptions && (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      )}
    </div>
  );
};

export default RenderChart;
