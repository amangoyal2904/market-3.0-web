import React, { useEffect } from "react";
import Highcharts from "highcharts";

interface PieChartProps {
  data: any;
  containerId: string;
  valueSuffix: string;
}

const PieChart: React.FC<PieChartProps> = React.memo(
  ({ data, containerId, valueSuffix = "" }: any) => {
    const drawChart = () => {
      const options: Highcharts.Options = {
        chart: {
          type: "pie",
          height: 200,
          width: 200,
          backgroundColor: "",
        },
        title: {
          text: "",
        },
        tooltip: {
          valueSuffix: valueSuffix,
        },
        credits: {
          enabled: false,
        },
        plotOptions: {
          pie: {
            allowPointSelect: false,
            cursor: "pointer",
            dataLabels: [
              {
                enabled: false,
                distance: 5,
              },
              {
                enabled: false,
                distance: -10,
                format: "{point.percentage:.1f}%",
                style: {
                  fontSize: "1em",
                  textOutline: "none",
                  opacity: 0.8,
                },
                filter: {
                  operator: ">",
                  property: "percentage",
                  value: 10,
                },
              },
            ],
          },
        },
        series: [
          {
            type: "pie",
            name: "holding value",
            data: data,
          },
        ],
      };

      Highcharts.chart(containerId, options);
    };

    useEffect(() => {
      drawChart();
    }, [data, containerId]);

    return <div id={containerId}></div>;
  },
);

PieChart.displayName = "PieChart";
export default PieChart;
