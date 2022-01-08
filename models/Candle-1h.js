const mongoose = require('mongoose');

module.exports = {
  modelName: 'Candle1h',
};

module.exports.setModuleExport = (modelSchema) => {
  const Model = new mongoose.Schema(modelSchema, { versionKey: false });
  module.exports = mongoose.model('Candle1h', Model, 'candles-1h');
};
