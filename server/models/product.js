const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  images: [{
    type: Object,
  }],
  isPublished: {
    type: Boolean,
    required: true
  },
  isBooked: {
    type: Boolean,
    required: true
  },
  isSold: {
    type: Boolean,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  buyer: {
    name: String,
    email: String,
  }
});

module.exports = mongoose.model('Product', productSchema);
