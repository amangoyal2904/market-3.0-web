import React, { useEffect } from "react";
import Highcharts from "highcharts";

interface PieChartProps {
  data: any;
  containerId: string;
  valueSuffix: string;
  totalCompany: any;
  declareCompany: any;
}

const PieChartSector: React.FC<PieChartProps> = React.memo(
  ({
    data,
    containerId,
    valueSuffix = "",
    totalCompany,
    declareCompany,
  }: any) => {
    const drawChart = () => {
      const options: Highcharts.Options = {
        chart: {
          type: "pie",
          height: 250,
          width: 250,
          backgroundColor: "",
          events: {
            render() {
              const chart = this as Highcharts.Chart;
              const series = chart.series[0];
              let customLabel = (chart.options.chart as any).custom?.label;

              if (!customLabel) {
                customLabel = (chart.options.chart as any).custom = {
                  label: chart.renderer
                    .label(
                      `<strong style="font-size:32px">${totalCompany}</strong>/${declareCompany}`,
                      series.center[0] - 20,
                      series.center[1] - 10,
                    )
                    .css({
                      color: "#000",
                      textAlign: "center",
                    })
                    .add(),
                };
              }

              const x =
                series.center[0] +
                chart.plotLeft -
                customLabel.label.getBBox().width / 2;
              const y =
                series.center[1] +
                chart.plotTop -
                customLabel.label.getBBox().height / 2 +
                14;

              customLabel.label.attr({ x, y });
              customLabel.label.css({
                fontSize: `${series.center[2] / 10}px`,
              });
            },
          },
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
            innerSize: "75%",
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
            name: "Value",
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

PieChartSector.displayName = "PieChart";
export default PieChartSector;
