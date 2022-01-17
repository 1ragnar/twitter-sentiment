import React from 'react';
import './GraphPagination.css';

export type IGraphPaginationProps = {
  onPageChange: (direction: 'previous' | 'next') => void;
  previousMonthYear: string;
  nextMonthYear: string | undefined;
};

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//     flexDirection: 'row',
//     height: 60,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   button: {
//     fontSize: 'small',
//   },
//   disabledButton: {
//     fontSize: 'small',
//     opacity: 0.2,
//   },
// }));

const GraphPagination: React.FC<IGraphPaginationProps> = ({
  onPageChange,
  previousMonthYear,
  nextMonthYear,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '20%',
      }}
    >
      {previousMonthYear}
      <a
        href='#'
        className='previous round'
        onClick={() => {
          onPageChange('previous');
        }}
      >
        &#8249;
      </a>
      <a
        href='#'
        className='next round'
        onClick={() => {
          onPageChange('next');
        }}
      >
        &#8250;
      </a>
      {nextMonthYear}
    </div>
  );
};

export { GraphPagination };
