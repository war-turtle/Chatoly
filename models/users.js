const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const userSchema = mongoose.Schema({
  username: { type: String, unique: true },
  fullname: { type: String, default: "" },
  password: { type: String, default: "" },
  userImage: { type: String, default: "defaultPic.png" },
  email: { type: String, unique: true },
  google: { type: String, default: "" },
  sentRequest: [
    {
      username: { type: String, default: "" }
    }
  ],
  request: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: { type: String, default: "" }
    }
  ],
  friendsList: [
    {
      friendId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      friendName: { type: String, default: "" }
    }
  ],
  totalRequest: { type: Number, default: 0 }
});

userSchema.methods.encryptPassword = function encryptPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validUserPassword = function validUserPassword(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
