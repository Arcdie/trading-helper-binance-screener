const mongoose = require('mongoose');

module.exports = {
  modelName: 'Candle5m',
};

module.exports.setModuleExport = (modelSchema) => {
  const Model = new mongoose.Schema(modelSchema, { versionKey: false });
  module.exports = mongoose.model('Candle5m', Model, 'candles-5m');
};
