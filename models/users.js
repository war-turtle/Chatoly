const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
  username: { type: String, unique: true },
  fullname: { type: String, default: '' },
  password: { type: String, default: '' },
  userImage: { type: String, default: 'defaultPic.png' },
  email: { type: String, unique: true },
  google: { type: String, default: '' }
});

userSchema.methods.encryptPassword = function encryptPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validUserPassword = function validUserPassword(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
