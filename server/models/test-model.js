const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const testSchema = new Schema({
  testText: {
    type: String,
    require: true
  }
});

module.exports = mongoose.model('TestModel', testSchema);
