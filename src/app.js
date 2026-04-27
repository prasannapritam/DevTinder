const express = require('express');

const app = express();

const { adminAuth, userAuth } = require('./middleware/auth');

//Handel Auth Middleware
app.use('/admin', adminAuth);

app.post('/user/login', (req, res) => {
  res.send('User logged in succesfully');
});

app.get('/user', userAuth, (req, res) => {
  res.send('User data sent');
});

app.get('/admin/getAllData', (req, res) => {
  res.send('User Data Sent');
});

app.get('/admin/deleteUser', (req, res) => {
  res.send('Deleted a User');
});

app.listen(7777, () => {
  console.log('server is successfully listening on port 7777...');
});
