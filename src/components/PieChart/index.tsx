import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type PieChartData = {
  name: string;
  y: number;
};

interface PieChartProps {
  title?: string; // Optional title
  data: PieChartData[]; // Use the defined PieChartData type
  colors?: string[]; // Optional colors
  width?: number; // Optional width
  height?: number; // Optional height
  backgroundColor?: string;
}

const PieChart: React.FC<PieChartProps> = ({
  title = "",
  data,
  colors,
  width = 100,
  height = 100,
  backgroundColor = "#fff",
}) => {
  const options: Highcharts.Options = {
    chart: {
      type: "pie",
      backgroundColor: backgroundColor, // Make the background transparent
      width: width, // Set the width
      height: height, // Set the height
      style: {
        fontFamily: "var(--font-montserrat)",
      },
    },
    title: {
      text: title,
    },
    tooltip: {
      enabled: false, // Disable the tooltip
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        type: "pie",
        name: "Share",
        data: data,
        allowPointSelect: false,
        cursor: "default",
        states: {
          hover: {
            enabled: false,
          },
          select: {
            enabled: false,
          },
        },
      },
    ],
    plotOptions: {
      pie: {
        colors: colors || [
          "#7cb5ec",
          "#434348",
          "#90ed7d",
          "#f7a35c",
          "#8085e9",
        ],
        dataLabels: {
          enabled: true,
          formatter: function () {
            // Hide data labels if value is 0
            return !!this.y && this.y !== 0 ? this.y.toString() : null;
          },
          style: {
            fontSize: "8px",
            textOutline: "none",
          },
          distance: 1, // Distance from the pie slice to the label
          connectorPadding: 0, // Space between label and connector line
          crop: false, // Allows data labels to be visible outside the plot area
        },
        center: ["50%", "50%"], // Center the pie chart in the container
        size: "75%", // Adjust the size of the pie chart
      },
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default PieChart;
