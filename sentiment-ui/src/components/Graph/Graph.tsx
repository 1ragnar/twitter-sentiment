import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import ReactApexChart from 'react-apexcharts';

export interface ILineGraphData {
  labels: string[];
  datasets: {
    label?: string;
    data: any[];
    backgroundColor: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}
export interface ICandlestickData {
  x: Date;
  y: number[];
}

export type IGraphProps = {
  type: 'candlestick' | 'line';
  data: ICandlestickData[] | ILineGraphData;
};

const Graph: React.FC<IGraphProps> = ({ type, data }) => {
  const lineOptions = {
    maintainAspectRatio: false,
    legend: {
      labels: {
        fontColor: 'black',
      },
    },
    scales: {
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-1',
        },
      ],
    },
  };

  return (
    <div
      style={{
        marginTop: 20,
        height: '50%',
        width: '80%',
      }}
    >
      {type === 'line' ? (
        <Line data={data} options={lineOptions} height={350} />
      ) : (
        <ReactApexChart
          options={{
            plotOptions: {
              candlestick: {
                colors: {
                  upward: '#22a431',
                  downward: '#e2062c',
                },
                wick: {
                  useFillColor: true,
                },
              },
            },
            chart: {
              type: 'candlestick',
              height: 350,
              toolbar: {
                show: false,
              },
            },
            title: {
              text: 'BTC in $',
              align: 'left',
            },
            xaxis: {
              type: 'datetime',
              tooltip: {
                enabled: true,
              },
            },
            yaxis: {
              tooltip: {
                enabled: true,
              },
            },
            tooltip: {
              shared: false,
              intersect: true,
            },
          }}
          series={[
            {
              name: 'candle',
              data: data,
            },
          ]}
          type='candlestick'
          height={400}
        />
      )}
    </div>
  );
};

export { Graph };
