import React from 'react';
import moment from 'moment';

const ToDate = ({ x }) => {
  const date = moment(x).format('DD MMMM YYYY');
  return <>{date}</>;
}
const MillisToDate = ({ x }) => {
  const date = moment(x).format('DD MMMM YYYY');
  return <>{date}</>;
}

const DateToMillis = ({ x }) => {
  const milliseconds = moment(x).valueOf();
  return <>{milliseconds}</>;
}
// const DateToMillis = ({ x }) => {
//   const milliseconds = moment(x, "YYYY-MM-DD").milliseconds();
//   return <>{milliseconds}</>;
// }


export { ToDate, MillisToDate, DateToMillis }