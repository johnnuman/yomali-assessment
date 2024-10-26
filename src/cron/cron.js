const cron = require('node-cron');

cron.schedule('* * * * *', () => {
  console.log('Running aggregation task every minute');
});
