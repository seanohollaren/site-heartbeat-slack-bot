const Promise = require('bluebird');
const retry = require('bluebird-retry');
const request = require('request');
const payload = require('./payload');

// perform heartbeat request and alert to Slack if it fails
module.exports.heartbeat = (event, context, callback) => {

  // perform a heartbeat request and alert if it fails
  retry(() => performRequest(process.env.serviceEndpoint, payload), { max_tries: 3 })
    .then(() => finish(callback))
    .catch(err => reportError(err, callback));

};

// perform request - resolve if successful, reject on error or non-200 status
function performRequest(uri, body) {
  return new Promise((resolve, reject) => {

    console.log(`Sending a request to endpoint: ${process.env.serviceEndpoint}`);

    request({
      method: process.env.httpMethod,
      headers: {
        'Content-Type': 'application/json'
      },
      uri,
      timeout: 5000,
      body: (process.env.httpMethod === 'POST') ? JSON.stringify(body) : null
    }, (err, res) => {

      if (err || res.statusCode !== 200) {
        console.log('Failed request body: ', res.body);
        return reject(err || new Error(`Received a non-200 status code: ${res.statusCode}`));
      }

      return resolve();
    });
  });
}

// finish and signal success
function finish(callback) {
  console.log(`Successfully pinged endpoint: ${process.env.serviceEndpoint}`);
  callback(null, 'Success');
}

// report error to Slack
function reportError(err, callback) {

  const slackMessage = `*Endpoint Health Alert* \n\nRequest to monitored endpoint failed \n\n  Endpoint:\n  ${process.env.serviceEndpoint} \n\n  Error:\n  ${err.message}`;

  console.log('Reporting error...');
  console.log(slackMessage);

  request({
    method: 'POST',
    uri: process.env.slackEndpoint,
    body: {
      text: slackMessage
    },
    json: true
  }, () => callback(err));

}
