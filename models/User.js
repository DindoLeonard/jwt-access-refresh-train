const mongoose = require('mongoose');
// const Schema = mongoose.schema;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Editor: Number,
    Admin: Number,
  },
  password: {
    type: String,
    require: true,
  },
  refreshToken: String,
});

module.exports = mongoose.model('User', userSchema);
