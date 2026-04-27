const express = require('express');

const app = express();

app.use('/', (err, req, res, next) => {
  if (err) {
    res.status(500).send('Something went wrong');
  }
});

app.get('/getUserData', (req, res) => {
  // Logic of DB call and get user data
  try {
    throw new Error('djhbf');
    res.send('User Data Sent');
  } catch (err) {
    res.status(500).send('somethinng went wrong , contact supoort team');
  }
});

app.listen(7777, () => {
  console.log('server is successfully listening on port 7777...');
});
