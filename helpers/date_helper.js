const moment = require('moment');


const DateHelper = {};
DateHelper.datetime = str => {
  const date = new Date(str);
  return moment(date).format('ddd MMM Do YYYY, h:mm:ss a');
};


module.exports = DateHelper;
