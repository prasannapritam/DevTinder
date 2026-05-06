const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.use(express.json());

app.post('/signup', async (req, res) => {
  // creating a new instance of the User model
  const user = new User(req.body);
  try {
    await user.save();
    res.send('user addedd succesfully');
  } catch (err) {
    res.status(400).send('Error saving the user' + err.message);
  }
});

//Get user by email
app.get('/user', async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (!users.length === 0) {
      res.status(404).send('User not found');
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send('something went wrong');
  }
});

//Feed API- GET/feed - get all the users from the dtabase
app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send('something went wrong');
  }
});

//Delete a user from the database
app.delete('/user', async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send('User deleted succesfully');
  } catch (err) {
    res.status(400).send('something went wrong');
  }
});

//Update a user
app.patch('/user', async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: 'after',
      runValidators: true,
    });
    res.send('User updated succesfully');
  } catch (err) {
    res.status(400).send('Update failed' + err.message);
  }
});

connectDB()
  .then(() => {
    console.log('Database connection established...');
    app.listen(7777, () => {
      console.log('server is successfully listening on port 7777...');
    });
  })
  .catch((err) => {
    console.log('Database cannot be connected!!');
  });
