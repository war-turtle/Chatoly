const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  name: { type: String, default: '' },
  category: { type: String, default: '' },
  user: [
    {
      username: { type: String, default: '' },
      email: { type: String, default: '' }
    }
  ]
});

module.exports = mongoose.model('Group', groupSchema);
