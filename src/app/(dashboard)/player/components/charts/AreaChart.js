import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";

const AreaChart = () => {
  const data = {
    series: [
      {
        name: "Actual",
        data: [
          {
            x: "2011",
            y: 12,
            goals: [
              {
                name: "Expected",
                value: 14,
                strokeWidth: 2,
                strokeDashArray: 2,
                strokeColor: "#FFB020",
              },
            ],
          },
          {
            x: "2012",
            y: 44,
            goals: [
              {
                name: "Expected",
                value: 54,
                strokeWidth: 5,
                strokeHeight: 10,
                strokeColor: "#FFB020",
              },
            ],
          },
          {
            x: "2013",
            y: 54,
            goals: [
              {
                name: "Expected",
                value: 52,
                strokeWidth: 10,
                strokeHeight: 0,
                strokeLineCap: "round",
                strokeColor: "#FFB020",
              },
            ],
          },
          {
            x: "2014",
            y: 66,
            goals: [
              {
                name: "Expected",
                value: 61,
                strokeWidth: 10,
                strokeHeight: 0,
                strokeLineCap: "round",
                strokeColor: "#FFB020",
              },
            ],
          },
          {
            x: "2015",
            y: 81,
            goals: [
              {
                name: "Expected",
                value: 66,
                strokeWidth: 10,
                strokeHeight: 0,
                strokeLineCap: "round",
                strokeColor: "#FFB020",
              },
            ],
          },
          {
            x: "2016",
            y: 67,
            goals: [
              {
                name: "Expected",
                value: 70,
                strokeWidth: 5,
                strokeHeight: 10,
                strokeColor: "#FFB020",
              },
            ],
          },
        ],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar",
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      colors: ["#62A82C"],
      dataLabels: {
        formatter: function (val, opt) {
          const goals =
            opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex].goals;

          if (goals && goals.length) {
            return `${val} / ${goals[0].value}`;
          }
          return val;
        },
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        customLegendItems: ["Actual", "Expected"],
        markers: {
          fillColors: ["#62A82C", "#FFB020"],
        },
      },
    },
  };

  return (
    <div className="area">
      <Box
        sx={{
          width: "100%",
          height: 380,
        }}
      >
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
            Sales
          </Typography>
          <Chart
            options={data.options}
            series={data.series}
            type="bar"
            width="100%"
            height={"375"}
          />
        </Paper>
      </Box>
    </div>
  );
};

export default AreaChart;
