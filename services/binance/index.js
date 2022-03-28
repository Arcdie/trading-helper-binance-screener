const get1mCandlesForSpotInstruments = require('./spot/get-1m-candles-for-spot-instruments');
const get5mCandlesForSpotInstruments = require('./spot/get-5m-candles-for-spot-instruments');
const get1hCandlesForSpotInstruments = require('./spot/get-1h-candles-for-spot-instruments');
const getLimitOrdersForSpotInstruments = require('./spot/get-limit-orders-for-spot-instruments');

const get1mCandlesForFuturesInstruments = require('./futures/get-1m-candles-for-futures-instruments');
const get5mCandlesForFuturesInstruments = require('./futures/get-5m-candles-for-futures-instruments');
const get1hCandlesForFuturesInstruments = require('./futures/get-1h-candles-for-futures-instruments');
const getBookTickersForFuturesInstruments = require('./futures/get-book-tickers-for-futures-instruments');
const getLimitOrdersForFuturesInstruments = require('./futures/get-limit-orders-for-futures-instruments');

module.exports = async (instrumentsDocs = []) => {
  const spotDocs = instrumentsDocs
    .filter(doc => !doc.is_futures);

  const futuresDocs = instrumentsDocs
    .filter(doc => doc.is_futures);

  const spotDocsWithoutIgnoredVolume = spotDocs
    .filter(doc => !doc.does_ignore_volume);

  const futuresDocsWithoutIgnoredVolume = futuresDocs
    .filter(doc => !doc.does_ignore_volume);

  // await get1mCandlesForSpotInstruments(spotDocs);
  await get5mCandlesForSpotInstruments(spotDocs);
  await get1hCandlesForSpotInstruments(spotDocs);
  // await getLimitOrdersForSpotInstruments(spotDocsWithoutIgnoredVolume);

  // await get1mCandlesForFuturesInstruments(futuresDocs);
  await get5mCandlesForFuturesInstruments(futuresDocs);
  await get1hCandlesForFuturesInstruments(futuresDocs);
  // await getBookTickersForFuturesInstruments(futuresDocs);
  // await getLimitOrdersForFuturesInstruments(futuresDocsWithoutIgnoredVolume);
};
