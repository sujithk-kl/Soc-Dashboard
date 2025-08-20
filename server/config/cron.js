const { CronJob } = require('cron');
const http = require('http');
const https = require('https');

require('dotenv').config();

const backendUrl = process.env.BACKEND_URL;

// Only start cron job if BACKEND_URL is defined
if (backendUrl) {
  const job = new CronJob(
    '*/14 * * * *',
    function () {
      console.log(`Attempting to keep server active at ${backendUrl}`);

      try {
        const url = new URL(backendUrl);
        const client = url.protocol === 'http:' ? http : https;

        client
          .get(backendUrl, (res) => {
            if (res.statusCode === 200) {
              console.log('Server is active');
            } else {
              console.error(
                `Failed to reach server, status code: ${res.statusCode}`
              );
            }
          })
          .on('error', (err) => {
            console.error('Error during server ping:', err.message);
          });
      } catch (err) {
        console.error('Invalid BACKEND_URL:', err.message);
      }
    },
    null,
    true,
    'America/Los_Angeles'
  );

  module.exports = job;
} else {
  console.log('⚠️  BACKEND_URL not set - cron job disabled');
  module.exports = null;
}
