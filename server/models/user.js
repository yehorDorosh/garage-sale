const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    number: {
      type: String,
    },
    whatsApp: {
      type: Boolean,
    },
    viber: {
      type: Boolean,
    },
    telegram: {
      type: Boolean,
    },
  },
  password: {
    type: String,
    required: true,
  },
  sales: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Sale',
    },
  ]
});

module.exports = mongoose.model('User', userSchema);
