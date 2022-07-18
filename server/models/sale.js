const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const saleSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  isPublished: {
    type: Boolean,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
