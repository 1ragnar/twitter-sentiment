import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import moment from 'moment';
import { createLineGraphData } from 'helpers/helpers';
import ReactApexChart from 'react-apexcharts';
import { Graph } from 'components/Graph/Graph';
import { GraphPagination } from 'components/Graph/GraphPagination';

export interface IGraphData {
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

const apiUrl = `http://localhost:3001`;

const App: React.FC = (props: any) => {
  const [priceData, setPriceData] = useState<ICandlestickData[]>();
  const [sentimentData, setSentimentData] = useState<IGraphData>();

  const [endDate, setEndDate] = useState<Date>(new Date('2020-12-31'));
  const [startDate, setStartDate] = useState<Date>(new Date('2020-11-31'));

  useEffect(() => {
    getData();
  }, [endDate]);

  const getData = async () => {
    await axios
      .post(apiUrl + '/prices', { startDate: startDate, endDate: endDate })
      .then((res: any) => {
        setPriceData(
          res.data.map((item: any) => {
            return {
              x: new Date(item.time),
              y: [item.open, item.high, item.low, item.close],
            };
          })
        );
      });

    await axios
      .post(apiUrl + '/sentiments', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      })
      .then((res: any) => {
        setSentimentData(
          createLineGraphData(
            res.data,
            endDate,
            startDate,
            'Pos',
            'pos',
            'Neg',
            'neg'
          )
        );
      });
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* price graph */}
      {priceData && <Graph type='candlestick' data={priceData} />}

      {/* sentiment graph */}
      {sentimentData && <Graph type='line' data={sentimentData} />}
      <div
        style={{
          width: '100%',
          height: 100,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <GraphPagination
          onPageChange={(direction: 'previous' | 'next') => {
            if (direction === 'previous') {
              setEndDate(moment(endDate).subtract(1, 'months').toDate());
              setStartDate(moment(startDate).subtract(1, 'months').toDate());
            }
            if (direction === 'next') {
              setEndDate(moment(endDate).add(1, 'months').toDate());
              setStartDate(moment(startDate).add(1, 'months').toDate());
            }
          }}
          previousMonthYear={moment(endDate)
            .subtract(1, 'months')
            .format('MM/YY')}
          nextMonthYear={
            moment(endDate).isSame(new Date(), 'day')
              ? undefined
              : moment(endDate).add(1, 'months').format('MM/YY')
          }
        />
      </div>
    </div>
  );
};

export default App;
