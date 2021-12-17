const mongoose = require('mongoose');

module.exports = {
  modelName: 'Candle1m',
};

module.exports.setModuleExport = (modelSchema) => {
  const Model = new mongoose.Schema(modelSchema, { versionKey: false });
  module.exports = mongoose.model('Candle1m', Model, 'candles-1m');
};
