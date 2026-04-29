const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose.connect('mongodb+srv://pritamprasanna_db_user:afm1gBwUe00rjUom@tinderdev.7g9tqi3.mongodb.net/devTinder');
};

module.exports = connectDB;
