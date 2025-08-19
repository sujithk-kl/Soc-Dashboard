const { CronJob } = require('cron');
const https = require('https');

require('dotenv').config();

const backendUrl = process.env.BACKEND_URL;
if (!backendUrl) {
  console.error('Error: BACKEND_URL is not defined in environment variables.');
  process.exit(1);
}

const job = new CronJob(
  '*/14 * * * *',
  function () {
    console.log(`Attempting to keep server active at ${backendUrl}`);

    https
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
  },
  null,
  true,
  'America/Los_Angeles'
);

module.exports = job;
