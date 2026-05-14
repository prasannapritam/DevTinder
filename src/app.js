const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');

app.use(express.json());

app.post('/signup', async (req, res) => {
  try {
    //Validation of data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    // creating a new instance of the User model
    const user = new User({ firstName, lastName, emailId, password: passwordHash });

    await user.save();
    res.send('user addedd succesfully');
  } catch (err) {
    res.status(400).send('ERROR : ' + err.message);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send('Login successful!!!');
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (err) {
    res.status(400).send('Error :' + err.message);
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
    const ALLOWED_UPDATES = ['userId', 'photoUrl', 'about', 'gender', 'age', 'skills'];

    const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
    if (!isUpdateAllowed) {
      res.status(400).send('Update not allowed');
    }
    if (data?.skills?.length > 10) {
      throw new Error('Skills cannot be more than 10');
    }
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
