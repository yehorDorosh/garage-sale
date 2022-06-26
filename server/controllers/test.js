const TestModel = require('../models/test-model');

/* eslint no-console: "off" */

exports.test = async(req, res, next) => {
  try {
    const items = await TestModel.find();
    res.status(200).json({
      message: 'Got items form DB',
      items
    });
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({
    data: 'Test DATA'
  });
};

exports.testDB = async(req, res, next) => {
  const recivedData = req.body.test;
  const testItem = new TestModel({
    testText: recivedData
  });
  try {
    const result = await testItem.save();
    res.status(201).json({
      message: 'Added string to DB',
      item: result
    });
  } catch (err) {
    console.log(err);
  }
};
